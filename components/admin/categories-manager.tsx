'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { createCategory, updateCategory, deleteCategory } from '@/actions/category-actions'
import { slugify } from '@/lib/utils'
import type { StoreCategory } from '@/types'

function slugFromName(name: string) {
  return slugify(name)
}

// ── Add form ─────────────────────────────────────────────────────────────────

function AddCategoryForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      try {
        await createCategory({
          name: name.trim(),
          slug: slugFromName(name),
          description: description.trim() || null,
        })
        toast.success(`"${name}" created`)
        onDone()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to create category')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
      <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-500">
        New Category
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-light text-neutral-500">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Skincare"
            required
            autoFocus
            className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
          />
          {name && (
            <p className="mt-1 text-[10px] font-light text-neutral-400">
              Slug: {slugFromName(name)}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-light text-neutral-500">
            Description <span className="text-neutral-400">(optional)</span>
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending || !name.trim()}
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

function EditRow({
  category,
  onDone,
}: {
  category: StoreCategory
  onDone: () => void
}) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description ?? '')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateCategory(category.id, {
          name: name.trim(),
          slug: slugFromName(name),
          description: description.trim() || null,
        })
        toast.success('Category updated')
        onDone()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to update')
      }
    })
  }

  return (
    <tr className="border-b border-neutral-50 bg-neutral-50/60">
      <td className="px-5 py-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="h-8 w-full rounded-lg border border-neutral-300 bg-white px-3 text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400"
        />
      </td>
      <td className="px-5 py-3">
        <span className="font-mono text-[11px] text-neutral-400">{slugFromName(name)}</span>
      </td>
      <td className="px-5 py-3">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="h-8 w-full rounded-lg border border-neutral-300 bg-white px-3 text-[13px] font-light text-neutral-800 outline-none focus:border-neutral-400"
        />
      </td>
      <td className="px-5 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
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
              try {
                await deleteCategory(category.id)
                toast.success(`"${category.name}" deleted`)
              } catch {
                toast.error('Delete failed')
              }
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
    >
      <Trash2 size={13} strokeWidth={1.5} />
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CategoriesManager({ categories }: { categories: StoreCategory[] }) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

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

      {/* Add form */}
      {adding && (
        <AddCategoryForm
          onDone={() => setAdding(false)}
        />
      )}

      {/* Table */}
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
                {['Name', 'Slug', 'Description', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) =>
                editingId === cat.id ? (
                  <EditRow
                    key={cat.id}
                    category={cat}
                    onDone={() => setEditingId(null)}
                  />
                ) : (
                  <tr
                    key={cat.id}
                    className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/50"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-normal text-neutral-800">{cat.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] text-neutral-400">{cat.slug}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-light text-neutral-500 line-clamp-1">
                        {cat.description ?? '—'}
                      </span>
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
