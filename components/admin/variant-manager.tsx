'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, Check, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  createVariant,
  deleteVariant,
  updateVariantStock,
} from '@/actions/variant-actions'
import type { Variant } from '@/types'

interface Props {
  productId: string
  initialVariants: Variant[]
}

/* ── Add shade form ─────────────────────────────────────────────────────────── */
function AddShadeForm({
  productId,
  onAdded,
}: {
  productId: string
  onAdded: (v: Variant) => void
}) {
  const [pending, start] = useTransition()
  const [hex,     setHex]     = useState('#C9A96E')
  const [name,    setName]    = useState('')
  const [stock,   setStock]   = useState('0')
  const [sku,     setSku]     = useState('')
  const [imgUrl,  setImgUrl]  = useState('')

  async function handleAdd() {
    if (!name.trim()) return toast.error('Shade name is required')
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return toast.error('Enter a valid hex colour (#RRGGBB)')
    start(async () => {
      try {
        const v = await createVariant(productId, {
          shadeName: name.trim(),
          hexColor:  hex,
          stock:     Number(stock) || 0,
          sku:       sku.trim() || null,
          image:     imgUrl.trim() || null,
          sortOrder: 0,
        })
        onAdded(v)
        setName(''); setStock('0'); setSku(''); setImgUrl('')
        toast.success(`Shade "${v.shadeName}" added`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to add shade')
      }
    })
  }

  return (
    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-5">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        Add New Shade
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Colour picker + hex */}
        <div className="space-y-2">
          <Label className="text-[11px] font-light text-neutral-500">Colour</Label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className="h-11 w-11 cursor-pointer rounded-lg border border-neutral-200 shadow-sm"
                style={{ backgroundColor: hex }}
                onClick={() => document.getElementById(`picker-${productId}`)?.click()}
              />
              <input
                id={`picker-${productId}`}
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="sr-only"
              />
            </div>
            <Input
              value={hex}
              onChange={(e) => {
                const val = e.target.value
                setHex(val)
              }}
              maxLength={7}
              placeholder="#C9A96E"
              className="h-11 flex-1 rounded-lg border-neutral-200 font-mono text-[13px]"
            />
          </div>
        </div>

        {/* Shade name */}
        <div className="space-y-2">
          <Label className="text-[11px] font-light text-neutral-500">Shade Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rose Nude"
            className="h-11 rounded-lg border-neutral-200 text-[13px]"
          />
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label className="text-[11px] font-light text-neutral-500">Stock</Label>
          <Input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="h-11 rounded-lg border-neutral-200 text-[13px]"
          />
        </div>

        {/* SKU */}
        <div className="space-y-2">
          <Label className="text-[11px] font-light text-neutral-500">SKU <span className="text-neutral-400">(optional)</span></Label>
          <Input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. VML-RN"
            className="h-11 rounded-lg border-neutral-200 text-[13px] font-mono"
          />
        </div>
      </div>

      {/* Shade-specific image URL */}
      <div className="mt-4 space-y-2">
        <Label className="text-[11px] font-light text-neutral-500">
          Shade Image URL <span className="text-neutral-400">(optional — used in gallery swap)</span>
        </Label>
        <Input
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          placeholder="https://..."
          className="h-11 rounded-lg border-neutral-200 text-[13px]"
        />
      </div>

      <Button
        type="button"
        onClick={handleAdd}
        disabled={pending || !name.trim()}
        className="mt-4 flex h-9 items-center gap-2 rounded-full bg-neutral-900 px-5 text-[12px] font-light text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
        Add Shade
      </Button>
    </div>
  )
}

/* ── Single shade row ────────────────────────────────────────────────────────── */
function ShadeRow({
  variant,
  onDeleted,
  onStockChanged,
}: {
  variant: Variant
  onDeleted: (id: string) => void
  onStockChanged: (id: string, stock: number) => void
}) {
  const [deleting, startDelete]   = useTransition()
  const [editing,  setEditing]    = useState(false)
  const [stockVal, setStockVal]   = useState(String(variant.stock))
  const [saving,   startSave]     = useTransition()

  function handleDelete() {
    startDelete(async () => {
      try {
        await deleteVariant(variant.id)
        onDeleted(variant.id)
        toast.success(`Shade "${variant.shadeName}" deleted`)
      } catch {
        toast.error('Failed to delete shade')
      }
    })
  }

  function handleSaveStock() {
    const n = Number(stockVal)
    if (isNaN(n) || n < 0) return toast.error('Stock must be ≥ 0')
    startSave(async () => {
      try {
        await updateVariantStock(variant.id, n)
        onStockChanged(variant.id, n)
        setEditing(false)
        toast.success('Stock updated')
      } catch {
        toast.error('Failed to update stock')
      }
    })
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Colour swatch */}
      <div
        className="h-8 w-8 flex-shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: variant.hexColor }}
        title={variant.hexColor}
      />

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-neutral-800">{variant.shadeName}</p>
        <p className="text-[10px] font-mono text-neutral-400">{variant.hexColor}</p>
      </div>

      {/* SKU */}
      {variant.sku && (
        <span className="hidden rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500 sm:block">
          {variant.sku}
        </span>
      )}

      {/* Stock editor */}
      <div className="flex items-center gap-1.5">
        {editing ? (
          <>
            <Input
              type="number"
              min="0"
              value={stockVal}
              onChange={(e) => setStockVal(e.target.value)}
              className="h-7 w-16 rounded-lg border-neutral-200 text-center text-[12px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveStock()
                if (e.key === 'Escape') setEditing(false)
              }}
            />
            <button
              type="button"
              onClick={handleSaveStock}
              disabled={saving}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white disabled:opacity-50"
            >
              {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100"
          >
            {variant.stock} units
          </button>
        )}
      </div>

      {/* Out of stock badge */}
      {variant.stock === 0 && !editing && (
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-400">
          Out of stock
        </span>
      )}

      {/* Delete */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      >
        {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      </button>
    </div>
  )
}

/* ── Main VariantManager ─────────────────────────────────────────────────────── */
export function VariantManager({ productId, initialVariants }: Props) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants)

  function handleAdded(v: Variant) {
    setVariants((prev) => [...prev, v])
  }

  function handleDeleted(id: string) {
    setVariants((prev) => prev.filter((v) => v.id !== id))
  }

  function handleStockChanged(id: string, stock: number) {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, stock } : v)))
  }

  return (
    <div className="space-y-4">
      {/* Existing shades */}
      {variants.length > 0 ? (
        <div className="space-y-2">
          {variants.map((v) => (
            <ShadeRow
              key={v.id}
              variant={v}
              onDeleted={handleDeleted}
              onStockChanged={handleStockChanged}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-neutral-100 py-5 text-center text-[12px] font-light text-neutral-400">
          No shades yet — add the first one below.
        </p>
      )}

      {/* Add form */}
      <AddShadeForm productId={productId} onAdded={handleAdded} />
    </div>
  )
}
