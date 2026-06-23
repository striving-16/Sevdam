'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialInput,
} from '@/actions/testimonial-actions'
import type { Testimonial } from '@prisma/client'

const EMPTY: TestimonialInput = { text: '', name: '', role: '', stars: 5, sortOrder: 0 }

export function TestimonialsPanel({ testimonials }: { testimonials: Testimonial[] }) {
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState<TestimonialInput>(EMPTY)
  const [editId, setEditId]       = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function startEdit(t: Testimonial) {
    setEditId(t.id)
    setForm({ text: t.text, name: t.name, role: t.role, stars: t.stars, sortOrder: t.sortOrder })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.text.trim() || !form.name.trim() || !form.role.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    startTransition(async () => {
      try {
        if (editId) {
          await updateTestimonial(editId, form)
          toast.success('Testimonial updated')
        } else {
          await createTestimonial(form)
          toast.success('Testimonial added')
        }
        cancelForm()
      } catch {
        toast.error('Something went wrong')
      }
    })
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete testimonial from "${name}"?`)) return
    startTransition(async () => {
      try {
        await deleteTestimonial(id)
        toast.success('Deleted')
      } catch {
        toast.error('Failed to delete')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-[12px] font-light text-white hover:bg-neutral-700 transition-colors"
        >
          <Plus size={14} />
          Add testimonial
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-100 bg-white p-6 space-y-4"
        >
          <h2 className="text-[14px] font-light text-neutral-800">
            {editId ? 'Edit testimonial' : 'New testimonial'}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block mb-1.5 text-[11px] font-light uppercase tracking-[0.1em] text-neutral-500">
                Quote *
              </label>
              <textarea
                rows={3}
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="What the customer said…"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] font-light text-neutral-800 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 text-[11px] font-light uppercase tracking-[0.1em] text-neutral-500">
                  Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Sarah M."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[13px] font-light text-neutral-800 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-[11px] font-light uppercase tracking-[0.1em] text-neutral-500">
                  Role / Location *
                </label>
                <input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Verified Buyer · Dubai"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[13px] font-light text-neutral-800 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 text-[11px] font-light uppercase tracking-[0.1em] text-neutral-500">
                  Stars (1–5)
                </label>
                <select
                  value={form.stars}
                  onChange={(e) => setForm((f) => ({ ...f, stars: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[13px] font-light text-neutral-800 focus:border-neutral-400 focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-[11px] font-light uppercase tracking-[0.1em] text-neutral-500">
                  Sort order
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[13px] font-light text-neutral-800 focus:border-neutral-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-neutral-900 px-6 py-2 text-[12px] font-light text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Saving…' : editId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="text-[12px] font-light text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-neutral-100 bg-white py-16 text-center">
          <p className="text-[13px] font-light text-neutral-400">No testimonials yet.</p>
          <p className="mt-1 text-[11px] font-light text-neutral-300">Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-neutral-100 bg-white px-5 py-5"
            >
              <div className="flex-1 min-w-0">
                {/* Stars */}
                <div className="mb-2 flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={10} className="fill-[#C7A98B] text-[#C7A98B]" />
                  ))}
                </div>
                <p className="text-[13px] font-light italic text-neutral-700 line-clamp-2">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="mt-2 text-[12px] font-light text-neutral-500">{t.name}</p>
                <p className="text-[10px] font-light uppercase tracking-[0.12em] text-neutral-400">{t.role}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => startEdit(t)}
                  className="rounded-lg px-3 py-1.5 text-[11px] font-light text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  disabled={isPending}
                  className="rounded-lg px-2 py-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
