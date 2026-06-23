'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload, X, Link as LinkIcon, Star, Palette, Plus, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createProduct, updateProduct, uploadProductImageAction } from '@/actions/product-actions'
import { slugify } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/lib/validations'
import type { Product, ProductCategory } from '@/types'

type State = { error?: string; success?: boolean } | null

const FIELD_CLS = 'h-11 rounded-lg border-neutral-200 text-[14px] focus-visible:ring-neutral-300'

// ── Image section ─────────────────────────────────────────────────────────────

function ImageUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
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
      } catch (err) {
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
    return (
      <div className="relative h-52 w-52 overflow-hidden rounded-xl bg-neutral-100">
        <img src={value} alt="Product" className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-neutral-600 shadow-sm hover:bg-white"
        >
          <X size={14} />
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

// ── Gallery URL list ─────────────────────────────────────────────────────────

function GalleryEditor({
  urls,
  onChange,
}: {
  urls: string[]
  onChange: (urls: string[]) => void
}) {
  const [input, setInput] = useState('')

  function addUrl() {
    const trimmed = input.trim()
    if (!trimmed || urls.includes(trimmed)) return
    onChange([...urls, trimmed])
    setInput('')
  }

  function removeUrl(idx: number) {
    onChange(urls.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-2">
      {urls.map((url, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
          <img src={url} alt="" className="h-10 w-10 flex-shrink-0 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <span className="min-w-0 flex-1 truncate text-[11px] font-light text-neutral-500">{url}</span>
          <button type="button" onClick={() => removeUrl(i)} className="flex-shrink-0 text-neutral-300 hover:text-red-500">
            <X size={12} />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="https://... (paste gallery image URL)"
          className="h-9 rounded-lg border-neutral-200 text-[13px]"
        />
        <Button type="button" onClick={addUrl} disabled={!input.trim()} className="h-9 flex-shrink-0 rounded-full bg-neutral-900 px-3 text-white hover:bg-neutral-700 disabled:opacity-50">
          <Plus size={13} />
        </Button>
      </div>
    </div>
  )
}

// ── Variants toggle ──────────────────────────────────────────────────────────

function VariantsToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={[
        'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200',
        value
          ? 'border-[#C9A96E]/40 bg-[#FDF9F4]'
          : 'border-neutral-200 bg-white hover:border-neutral-300',
      ].join(' ')}
    >
      <div className={`flex items-center gap-3 ${value ? 'text-[#8B6E3E]' : 'text-neutral-700'}`}>
        <Palette size={15} strokeWidth={1.5} className={value ? 'text-[#C9A96E]' : 'text-neutral-400'} />
        <div className="text-left">
          <p className="text-[13px] font-normal">Has Shades / Variants</p>
          <p className={`text-[11px] font-light ${value ? 'text-[#9E8E80]' : 'text-neutral-400'}`}>
            {value ? 'Stock managed per shade — use the Shades panel below' : 'Single stock quantity, no shade options'}
          </p>
        </div>
      </div>
      <div className={['relative h-5 w-9 rounded-full transition-colors duration-200', value ? 'bg-[#C9A96E]' : 'bg-neutral-200'].join(' ')}>
        <div className={['absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200', value ? 'left-4' : 'left-0.5'].join(' ')} />
      </div>
    </button>
  )
}

// ── Best seller toggle ────────────────────────────────────────────────────────

function BestsellerToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={[
        'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200',
        value
          ? 'border-neutral-900 bg-neutral-900'
          : 'border-neutral-200 bg-white hover:border-neutral-300',
      ].join(' ')}
    >
      <div className={`flex items-center gap-3 ${value ? 'text-white' : 'text-neutral-700'}`}>
        <Star
          size={15}
          strokeWidth={1.5}
          className={value ? 'fill-white text-white' : 'text-neutral-400'}
        />
        <div className="text-left">
          <p className="text-[13px] font-normal">Best Seller</p>
          <p className={`text-[11px] font-light ${value ? 'text-white/60' : 'text-neutral-400'}`}>
            {value ? 'Shown in the Best Sellers section' : 'Not featured on homepage'}
          </p>
        </div>
      </div>

      {/* Toggle pill */}
      <div
        className={[
          'relative h-5 w-9 rounded-full transition-colors duration-200',
          value ? 'bg-white/30' : 'bg-neutral-200',
        ].join(' ')}
      >
        <div
          className={[
            'absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-all duration-200',
            value ? 'left-4 bg-white' : 'left-0.5 bg-white',
          ].join(' ')}
        />
      </div>
    </button>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const isEdit = !!product

  const [imageUrl, setImageUrl]       = useState(product?.imageUrl ?? '')
  const [gallery, setGallery]         = useState<string[]>(product?.gallery ?? [])
  const [nameValue, setNameValue]     = useState(product?.name_en ?? '')
  const [isBestseller, setBestseller] = useState(product?.isBestseller ?? false)
  const [hasVariants, setHasVariants] = useState(product?.hasVariants ?? false)
  const [isOffer, setIsOffer]         = useState(product?.isOffer ?? false)

  async function formAction(_prev: State, formData: FormData): Promise<State> {
    if (!imageUrl) return { error: 'Please add a product image' }

    const payload = {
      name_en:        formData.get('name_en')        as string,
      name_ar:        (formData.get('name_ar')        as string) || '',
      slug:           slugify(formData.get('name_en') as string),
      description_en: formData.get('description_en') as string,
      description_ar: (formData.get('description_ar') as string) || '',
      price:          Number(formData.get('price')),
      stock:          hasVariants ? 0 : Number(formData.get('stock')),
      imageUrl,
      gallery,
      hasVariants,
      category:       ((formData.get('category') as string) || 'SKINCARE') as ProductCategory,
      brand:          (formData.get('brand') as string) || null,
      tags:           [] as string[],
      isBestseller,
      isOffer,
      salePrice:      isOffer ? (Number(formData.get('salePrice')) || null) : null,
      benefits:       (formData.get('benefits') as string) || null,
      ingredients:    (formData.get('ingredients') as string) || null,
      usage:          (formData.get('usage') as string) || null,
    }

    try {
      if (isEdit) {
        await updateProduct(product.id, payload)
      } else {
        await createProduct(payload)
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

      {/* Image */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Product Image <span className="text-red-400">*</span>
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
            placeholder="e.g. CeraVe Moisturising Cream"
            className={FIELD_CLS}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[12px] font-light tracking-wide text-neutral-600">
            Slug <span className="text-[10px] text-neutral-400">(auto)</span>
          </Label>
          <Input
            value={slugify(nameValue)}
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
        <div className="space-y-2">
          <Label htmlFor="stock" className="text-[12px] font-light tracking-wide text-neutral-600">
            Stock Quantity <span className="text-red-400">*</span>
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={product?.stock}
            placeholder="0"
            className={FIELD_CLS}
          />
        </div>
      </div>

      {/* Category + Brand */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-[12px] font-light tracking-wide text-neutral-600">
            Category
          </Label>
          <select
            id="category"
            name="category"
            defaultValue={product?.category ?? 'SKINCARE'}
            className={`${FIELD_CLS} w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white px-3 text-[14px]`}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-[12px] font-light tracking-wide text-neutral-600">
            Brand
          </Label>
          <Input
            id="brand"
            name="brand"
            defaultValue={product?.brand ?? ''}
            placeholder="e.g. CeraVe, COSRX, L'Oréal"
            className={FIELD_CLS}
          />
        </div>
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

      {/* Gallery */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Gallery Images <span className="text-[10px] text-neutral-400">(optional — shown as thumbnails on product page)</span>
        </Label>
        <GalleryEditor urls={gallery} onChange={setGallery} />
      </div>

      {/* Benefits */}
      <div className="space-y-2">
        <Label htmlFor="benefits" className="text-[12px] font-light tracking-wide text-neutral-600">
          Benefits <span className="text-[10px] text-neutral-400">(optional)</span>
        </Label>
        <Textarea
          id="benefits"
          name="benefits"
          defaultValue={product?.benefits ?? ''}
          placeholder="Key product benefits shown on the product page…"
          rows={3}
          className="resize-none rounded-lg border-neutral-200 text-[14px] focus-visible:ring-neutral-300"
        />
      </div>

      {/* Usage */}
      <div className="space-y-2">
        <Label htmlFor="usage" className="text-[12px] font-light tracking-wide text-neutral-600">
          How to Use <span className="text-[10px] text-neutral-400">(optional)</span>
        </Label>
        <Textarea
          id="usage"
          name="usage"
          defaultValue={product?.usage ?? ''}
          placeholder="Application instructions…"
          rows={3}
          className="resize-none rounded-lg border-neutral-200 text-[14px] focus-visible:ring-neutral-300"
        />
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <Label htmlFor="ingredients" className="text-[12px] font-light tracking-wide text-neutral-600">
          Ingredients <span className="text-[10px] text-neutral-400">(optional)</span>
        </Label>
        <Textarea
          id="ingredients"
          name="ingredients"
          defaultValue={product?.ingredients ?? ''}
          placeholder="Full INCI ingredient list…"
          rows={3}
          className="resize-none rounded-lg border-neutral-200 text-[14px] focus-visible:ring-neutral-300"
        />
      </div>

      {/* Has Variants toggle */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Product Type
        </Label>
        <VariantsToggle value={hasVariants} onChange={setHasVariants} />
        {hasVariants && (
          <p className="text-[11px] font-light text-[#C9A96E]">
            Stock quantity above will be ignored — stock is tracked per shade in the Shades panel.
          </p>
        )}
      </div>

      {/* Best seller toggle */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Homepage Visibility
        </Label>
        <BestsellerToggle value={isBestseller} onChange={setBestseller} />
      </div>

      {/* Offer toggle + sale price */}
      <div className="space-y-2">
        <Label className="text-[12px] font-light tracking-wide text-neutral-600">
          Offer / Promotion
        </Label>
        <button
          type="button"
          onClick={() => setIsOffer((v) => !v)}
          className={[
            'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200',
            isOffer ? 'border-amber-300 bg-amber-50' : 'border-neutral-200 bg-white hover:border-neutral-300',
          ].join(' ')}
        >
          <div className={`flex items-center gap-3 ${isOffer ? 'text-amber-800' : 'text-neutral-700'}`}>
            <Tag size={15} strokeWidth={1.5} className={isOffer ? 'text-amber-500' : 'text-neutral-400'} />
            <div className="text-left">
              <p className="text-[13px] font-normal">On Offer</p>
              <p className={`text-[11px] font-light ${isOffer ? 'text-amber-700' : 'text-neutral-400'}`}>
                {isOffer ? 'Shown in the Offers section with sale price' : 'Not currently on offer'}
              </p>
            </div>
          </div>
          <div className={['relative h-5 w-9 rounded-full transition-colors duration-200', isOffer ? 'bg-amber-400' : 'bg-neutral-200'].join(' ')}>
            <div className={['absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200', isOffer ? 'left-4' : 'left-0.5'].join(' ')} />
          </div>
        </button>
        {isOffer && (
          <div className="flex items-center gap-2 pl-1">
            <Label htmlFor="salePrice" className="shrink-0 text-[12px] font-light text-neutral-600">
              Sale Price (MRU)
            </Label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              step="1"
              min="1"
              defaultValue={product?.salePrice ?? ''}
              placeholder="e.g. 350"
              className="h-9 w-36 rounded-lg border-neutral-200 text-[13px]"
            />
          </div>
        )}
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
