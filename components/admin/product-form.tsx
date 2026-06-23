'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload, X, Link as LinkIcon, Star, Palette, Tag, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createProduct, updateProduct, uploadProductImageAction, type ShadeInput } from '@/actions/product-actions'
import { slugify } from '@/lib/utils'
import { MAKEUP_CATEGORIES, CATEGORY_LABELS } from '@/lib/validations'
import type { Product, ProductCategory } from '@/types'

type State = { error?: string; success?: boolean } | null

const FIELD_CLS = 'h-11 rounded-lg border-neutral-200 text-[14px] focus-visible:ring-neutral-300'

// ── Shared image upload widget ────────────────────────────────────────────────

function ImageUpload({
  value,
  onChange,
  compact = false,
}: {
  value: string
  onChange: (url: string) => void
  compact?: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, startUpload] = useTransition()
  const [urlMode, setUrlMode] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    startUpload(async () => {
      try {
        const fd = new FormData()
        fd.append('file', file)
        const url = await uploadProductImageAction(fd)
        onChange(url)
        toast.success('Image uploaded')
      } catch {
        toast.error('Upload failed — use the URL option instead')
      }
    })
  }

  function handleUrlConfirm() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    onChange(trimmed)
    setUrlMode(false)
    setUrlInput('')
  }

  if (value) {
    const size = compact ? 'h-16 w-16' : 'h-52 w-52'
    return (
      <div className={`relative overflow-hidden rounded-xl bg-neutral-100 ${size}`}>
        <img src={value} alt="" className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-neutral-600 shadow-sm hover:bg-white"
        >
          <X size={compact ? 10 : 14} />
        </button>
      </div>
    )
  }

  if (urlMode) {
    return (
      <div className="w-full max-w-sm space-y-2">
        <Label className="text-[11px] font-light text-neutral-500">Paste image URL</Label>
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlConfirm())}
            placeholder="https://..."
            autoFocus
            className={FIELD_CLS}
          />
          <Button
            type="button"
            onClick={handleUrlConfirm}
            disabled={!urlInput.trim()}
            className="h-11 rounded-lg bg-neutral-900 px-4 text-[13px] text-white hover:bg-neutral-700"
          >
            Use
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setUrlMode(false)}
          className="text-[11px] font-light text-neutral-400 hover:text-neutral-600"
        >
          ← Back to upload
        </button>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-neutral-600"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} strokeWidth={1.5} />}
        </button>
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className="flex h-16 w-6 items-center justify-center text-neutral-300 hover:text-neutral-500"
          title="Paste URL"
        >
          <LinkIcon size={12} strokeWidth={1.5} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex h-52 w-52 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-neutral-600"
      >
        {uploading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span className="text-[12px] font-light">Uploading…</span>
          </>
        ) : (
          <>
            <Upload size={20} strokeWidth={1.5} />
            <span className="text-[12px] font-light">Upload image</span>
            <span className="text-[10px] text-neutral-300">JPG, PNG, WEBP</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => setUrlMode(true)}
        className="flex items-center gap-1.5 text-[12px] font-light text-neutral-400 hover:text-neutral-700"
      >
        <LinkIcon size={12} strokeWidth={1.5} />
        Or paste a URL
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ── Shade editor ──────────────────────────────────────────────────────────────

function ShadeRow({
  shade,
  onChange,
  onRemove,
}: {
  shade: ShadeInput
  onChange: (patch: Partial<ShadeInput>) => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
      {/* Shade image */}
      <div className="flex-shrink-0">
        <ImageUpload
          compact
          value={shade.image}
          onChange={(url) => onChange({ image: url })}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {/* Name + color */}
        <div className="flex gap-2">
          <Input
            value={shade.shadeName}
            onChange={(e) => onChange({ shadeName: e.target.value })}
            placeholder="Shade name e.g. Rose Nude"
            className="h-9 flex-1 rounded-lg border-neutral-200 text-[13px]"
          />
          <div className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2">
            <input
              type="color"
              value={shade.hexColor}
              onChange={(e) => onChange({ hexColor: e.target.value })}
              className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
              title="Pick shade colour"
            />
            <input
              type="text"
              value={shade.hexColor}
              onChange={(e) => onChange({ hexColor: e.target.value })}
              maxLength={7}
              className="w-[72px] border-0 bg-transparent text-[12px] font-mono text-neutral-600 outline-none"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2">
          <Label className="shrink-0 text-[11px] font-light text-neutral-500">Stock</Label>
          <Input
            type="number"
            min="0"
            value={shade.stock}
            onChange={(e) => onChange({ stock: Number(e.target.value) })}
            className="h-8 w-24 rounded-lg border-neutral-200 text-[13px]"
          />
          {!shade.image && (
            <span className="text-[10px] text-amber-500">← shade image required</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="mt-0.5 flex-shrink-0 rounded-lg p-1.5 text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-400"
      >
        <Trash2 size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function ShadeEditor({
  shades,
  onChange,
}: {
  shades: ShadeInput[]
  onChange: (shades: ShadeInput[]) => void
}) {
  function addShade() {
    onChange([...shades, { shadeName: '', hexColor: '#C7A98B', stock: 0, image: '' }])
  }

  function updateShade(idx: number, patch: Partial<ShadeInput>) {
    const next = shades.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    onChange(next)
  }

  function removeShade(idx: number) {
    onChange(shades.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-2.5">
      {shades.map((shade, i) => (
        <ShadeRow
          key={i}
          shade={shade}
          onChange={(patch) => updateShade(i, patch)}
          onRemove={() => removeShade(i)}
        />
      ))}
      <button
        type="button"
        onClick={addShade}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 py-3 text-[12px] font-light text-neutral-400 transition-colors hover:border-[#C7A98B] hover:text-[#C7A98B]"
      >
        <Plus size={14} strokeWidth={1.5} />
        Add shade
      </button>
    </div>
  )
}

// ── Toggle button (shared pattern) ───────────────────────────────────────────

function Toggle({
  value,
  onChange,
  icon,
  label,
  description,
  activeClass = 'border-neutral-900 bg-neutral-900',
  pillClass = 'bg-white/30',
  textClass = 'text-white',
  subTextClass = 'text-white/60',
}: {
  value: boolean
  onChange: (v: boolean) => void
  icon: React.ReactNode
  label: string
  description: string
  activeClass?: string
  pillClass?: string
  textClass?: string
  subTextClass?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={[
        'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200',
        value ? activeClass : 'border-neutral-200 bg-white hover:border-neutral-300',
      ].join(' ')}
    >
      <div className={`flex items-center gap-3 ${value ? textClass : 'text-neutral-700'}`}>
        {icon}
        <div className="text-left">
          <p className="text-[13px] font-normal">{label}</p>
          <p className={`text-[11px] font-light ${value ? subTextClass : 'text-neutral-400'}`}>
            {description}
          </p>
        </div>
      </div>
      <div className={['relative h-5 w-9 rounded-full transition-colors duration-200', value ? pillClass : 'bg-neutral-200'].join(' ')}>
        <div className={['absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200', value ? 'left-4' : 'left-0.5'].join(' ')} />
      </div>
    </button>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const isEdit = !!product

  const [imageUrl, setImageUrl]       = useState(product?.imageUrl ?? '')
  const [nameValue, setNameValue]     = useState(product?.name_en ?? '')
  const [isBestseller, setBestseller] = useState(product?.isBestseller ?? false)
  const [hasVariants, setHasVariants] = useState(product?.hasVariants ?? false)
  const [isOffer, setIsOffer]         = useState(product?.isOffer ?? false)
  const [shades, setShades]           = useState<ShadeInput[]>(
    product?.variants?.map((v) => ({
      id:        v.id,
      shadeName: v.shadeName,
      hexColor:  v.hexColor,
      stock:     v.stock,
      image:     v.image ?? '',
      sku:       v.sku,
    })) ?? []
  )

  async function formAction(_prev: State, formData: FormData): Promise<State> {
    if (!imageUrl) return { error: 'Please add a product image' }

    if (hasVariants) {
      if (shades.length === 0) return { error: 'Add at least one shade for a variant product' }
      const missing = shades.findIndex((s) => !s.shadeName.trim() || !s.image)
      if (missing !== -1) return { error: `Shade ${missing + 1}: shade name and image are required` }
    }

    const payload = {
      name_en:        formData.get('name_en')        as string,
      name_ar:        (formData.get('name_ar')        as string) || '',
      slug:           isEdit ? product.slug : slugify(formData.get('name_en') as string),
      description_en: formData.get('description_en') as string,
      description_ar: (formData.get('description_ar') as string) || '',
      price:          Number(formData.get('price')),
      stock:          hasVariants ? 0 : Number(formData.get('stock')),
      imageUrl,
      gallery:        [] as string[],
      hasVariants,
      category:       ((formData.get('category') as string) || 'LIPSTICK') as ProductCategory,
      brand:          'Besma Sevdam',
      tags:           [] as string[],
      isBestseller,
      isOffer,
      salePrice:      null,
      benefits:       null,
      ingredients:    null,
      usage:          null,
    }

    try {
      if (isEdit) {
        await updateProduct(product.id, payload, hasVariants ? shades : [])
      } else {
        await createProduct(payload, hasVariants ? shades : [])
      }
      return { success: true }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Something went wrong' }
    }
  }

  const [state, action, pending] = useActionState(formAction, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(isEdit ? 'Product updated' : 'Product created')
      router.push('/admin/products')
      router.refresh()
    }
    if (state?.error) toast.error(state.error)
  }, [state, isEdit, router])

  return (
    <form action={action} className="max-w-2xl space-y-7">

      {/* Cover image */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Cover Image <span className="text-red-400">*</span>
        </Label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
      </div>

      {/* Name EN + Slug */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name_en" className="text-[12px] font-light tracking-wide text-neutral-600">
            Product Name (English) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name_en"
            name="name_en"
            required
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="e.g. Mate Liquid Lipstick"
            className={FIELD_CLS}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[12px] font-light tracking-wide text-neutral-600">
            Slug <span className="text-[10px] text-neutral-400">(auto)</span>
          </Label>
          <Input
            value={isEdit ? product.slug : slugify(nameValue)}
            readOnly
            className={`${FIELD_CLS} cursor-default bg-neutral-50 text-neutral-400`}
          />
        </div>
      </div>

      {/* Name AR */}
      <div className="space-y-2">
        <Label htmlFor="name_ar" className="text-[12px] font-light tracking-wide text-neutral-600">
          Product Name (Arabic) <span className="text-[10px] text-neutral-400">(optional)</span>
        </Label>
        <Input
          id="name_ar"
          name="name_ar"
          dir="rtl"
          defaultValue={product?.name_ar ?? ''}
          placeholder="اسم المنتج بالعربية"
          className={`${FIELD_CLS} text-right`}
        />
      </div>

      {/* Price + Stock */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-[12px] font-light tracking-wide text-neutral-600">
            Price (MRU) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="1"
            min="1"
            required
            defaultValue={product?.price}
            placeholder="0"
            className={FIELD_CLS}
          />
        </div>
        {!hasVariants && (
          <div className="space-y-2">
            <Label htmlFor="stock" className="text-[12px] font-light tracking-wide text-neutral-600">
              Stock Quantity <span className="text-red-400">*</span>
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock}
              placeholder="0"
              className={FIELD_CLS}
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-[12px] font-light tracking-wide text-neutral-600">
          Category
        </Label>
        <select
          id="category"
          name="category"
          defaultValue={product?.category ?? 'LIPSTICK'}
          className={`${FIELD_CLS} w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white px-3 text-[14px]`}
        >
          {MAKEUP_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {/* Description EN */}
      <div className="space-y-2">
        <Label htmlFor="description_en" className="text-[12px] font-light tracking-wide text-neutral-600">
          Description (English) <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="description_en"
          name="description_en"
          required
          defaultValue={product?.description_en}
          placeholder="Describe the product — what it does, who it's for, key benefits…"
          rows={4}
          className="resize-none rounded-lg border-neutral-200 text-[14px] focus-visible:ring-neutral-300"
        />
      </div>

      {/* Description AR */}
      <div className="space-y-2">
        <Label htmlFor="description_ar" className="text-[12px] font-light tracking-wide text-neutral-600">
          Description (Arabic) <span className="text-[10px] text-neutral-400">(optional)</span>
        </Label>
        <Textarea
          id="description_ar"
          name="description_ar"
          dir="rtl"
          defaultValue={product?.description_ar}
          placeholder="وصف المنتج بالعربية…"
          rows={3}
          className="resize-none rounded-lg border-neutral-200 text-[14px] text-right focus-visible:ring-neutral-300"
        />
      </div>

      {/* Has Variants toggle + Shade editor */}
      <div className="space-y-3">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Product Type
        </Label>
        <Toggle
          value={hasVariants}
          onChange={setHasVariants}
          icon={<Palette size={15} strokeWidth={1.5} className={hasVariants ? 'text-[#C9A96E]' : 'text-neutral-400'} />}
          label="Has Shades / Variants"
          description={hasVariants ? 'Stock managed per shade — add shades below' : 'Single stock quantity, no shade options'}
          activeClass="border-[#C9A96E]/40 bg-[#FDF9F4]"
          pillClass="bg-[#C9A96E]"
          textClass="text-[#8B6E3E]"
          subTextClass="text-[#9E8E80]"
        />

        {hasVariants && (
          <div className="rounded-xl border border-[#C9A96E]/20 bg-[#FDFAF6] p-4">
            <p className="mb-3 text-[11px] font-light text-[#9E8E80]">
              Each shade needs a name, hex colour, stock quantity, and a shade image (required — shown on product page when shade is selected).
            </p>
            <ShadeEditor shades={shades} onChange={setShades} />
          </div>
        )}
      </div>

      {/* Best seller */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Homepage Visibility
        </Label>
        <Toggle
          value={isBestseller}
          onChange={setBestseller}
          icon={<Star size={15} strokeWidth={1.5} className={isBestseller ? 'fill-white text-white' : 'text-neutral-400'} />}
          label="Best Seller"
          description={isBestseller ? 'Shown in the Best Sellers section on the homepage' : 'Not featured on homepage'}
        />
      </div>

      {/* Offer toggle */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Offer Section
        </Label>
        <Toggle
          value={isOffer}
          onChange={setIsOffer}
          icon={<Tag size={15} strokeWidth={1.5} className={isOffer ? 'text-amber-500' : 'text-neutral-400'} />}
          label="Featured in Offers"
          description={isOffer ? 'Shown in the Offers section — a visibility flag, not a discount' : 'Not shown in Offers section'}
          activeClass="border-amber-300 bg-amber-50"
          pillClass="bg-amber-400"
          textClass="text-amber-800"
          subTextClass="text-amber-700"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600">{state.error}</p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={pending}
          className="h-10 rounded-full bg-neutral-900 px-7 text-[13px] font-light text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={13} className="animate-spin" />
              Saving…
            </span>
          ) : isEdit ? 'Save Changes' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="h-10 rounded-full px-6 text-[13px] font-light text-neutral-500 hover:text-neutral-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
