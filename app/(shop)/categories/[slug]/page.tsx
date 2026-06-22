import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProducts } from '@/actions/product-actions'
import { ProductGrid, ProductGridSkeleton } from '@/components/products/product-grid'
import { CategoryPageFilters } from '@/components/products/category-page-filters'

type CategoryDef = {
  enum: string
  label: string
  labelAr: string
  description: string
  subcategories: { value: string; label: string }[]
  emoji: string
}

const CATEGORY_MAP: Record<string, CategoryDef> = {
  skincare: {
    enum: 'SKINCARE',
    label: 'Skincare',
    labelAr: 'العناية بالبشرة',
    description: 'Serums, moisturizers, SPF and daily rituals for radiant skin',
    emoji: '✨',
    subcategories: [
      { value: 'serum',        label: 'Serums' },
      { value: 'cleanser',     label: 'Cleansers' },
      { value: 'sunscreen',    label: 'Sunscreen' },
      { value: 'moisturizer',  label: 'Moisturizers' },
      { value: 'toner',        label: 'Toners' },
      { value: 'eye-cream',    label: 'Eye Creams' },
      { value: 'mask',         label: 'Face Masks' },
    ],
  },
  haircare: {
    enum: 'HAIRCARE',
    label: 'Hair Care',
    labelAr: 'العناية بالشعر',
    description: 'Shampoos, conditioners, masks and scalp treatments',
    emoji: '💆',
    subcategories: [
      { value: 'shampoo',     label: 'Shampoo' },
      { value: 'conditioner', label: 'Conditioners' },
      { value: 'hair-oil',    label: 'Hair Oil' },
      { value: 'hair-mask',   label: 'Hair Masks' },
      { value: 'scalp',       label: 'Scalp Care' },
      { value: 'styling',     label: 'Styling' },
    ],
  },
  perfumes: {
    enum: 'PERFUMES',
    label: 'Perfumes',
    labelAr: 'العطور',
    description: 'Fragrances, oud, body mists and signature scents',
    emoji: '🌸',
    subcategories: [
      { value: 'women',       label: 'Women' },
      { value: 'men',         label: 'Men' },
      { value: 'unisex',      label: 'Unisex' },
      { value: 'oud',         label: 'Oud' },
      { value: 'body-mist',   label: 'Body Mist' },
      { value: 'travel-size', label: 'Travel Size' },
    ],
  },
  makeup: {
    enum: 'MAKEUP',
    label: 'Makeup',
    labelAr: 'مستحضرات التجميل',
    description: 'Foundation, lipstick, mascara and colour cosmetics',
    emoji: '💄',
    subcategories: [
      { value: 'foundation',  label: 'Foundation' },
      { value: 'lips',        label: 'Lips' },
      { value: 'eyes',        label: 'Eyes' },
      { value: 'blush',       label: 'Blush & Bronzer' },
      { value: 'primer',      label: 'Primers' },
      { value: 'setting',     label: 'Setting Spray' },
    ],
  },
  bodycare: {
    enum: 'BODYCARE',
    label: 'Body Care',
    labelAr: 'العناية بالجسم',
    description: 'Body lotions, scrubs, deodorants and bath essentials',
    emoji: '🧴',
    subcategories: [
      { value: 'body-lotion', label: 'Body Lotion' },
      { value: 'scrub',       label: 'Body Scrubs' },
      { value: 'deodorant',   label: 'Deodorants' },
      { value: 'bath',        label: 'Bath & Shower' },
      { value: 'hand-cream',  label: 'Hand & Nail' },
      { value: 'foot',        label: 'Foot Care' },
    ],
  },
  mencare: {
    enum: 'MENCARE',
    label: "Men's Care",
    labelAr: 'العناية بالرجال',
    description: 'Grooming, skincare, beard care and men\'s fragrances',
    emoji: '🧔',
    subcategories: [
      { value: 'face-wash',   label: 'Face Wash' },
      { value: 'shaving',     label: 'Shaving' },
      { value: 'beard',       label: 'Beard Care' },
      { value: 'moisturizer', label: 'Moisturizers' },
      { value: 'deodorant',   label: 'Deodorants' },
      { value: 'fragrance',   label: 'Fragrances' },
    ],
  },
  babycare: {
    enum: 'BABYCARE',
    label: 'Baby Care',
    labelAr: 'العناية بالأطفال',
    description: 'Gentle baby skincare, hair care and bath products',
    emoji: '🍼',
    subcategories: [
      { value: 'baby-lotion', label: 'Baby Lotion' },
      { value: 'baby-wash',   label: 'Baby Wash' },
      { value: 'baby-shampoo',label: 'Baby Shampoo' },
      { value: 'diaper',      label: 'Diaper Care' },
      { value: 'baby-oil',    label: 'Baby Oil' },
    ],
  },
  tools: {
    enum: 'TOOLS',
    label: 'Beauty Tools',
    labelAr: 'أدوات التجميل',
    description: 'Brushes, face rollers, gua sha, and beauty accessories',
    emoji: '🪥',
    subcategories: [
      { value: 'brushes',     label: 'Brushes & Sponges' },
      { value: 'roller',      label: 'Face Rollers' },
      { value: 'gua-sha',     label: 'Gua Sha' },
      { value: 'hair-tools',  label: 'Hair Tools' },
      { value: 'accessories', label: 'Accessories' },
    ],
  },
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; sub?: string; brand?: string; instock?: string }>
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const cat = CATEGORY_MAP[slug]
  if (!cat) return {}
  return { title: `${cat.label} — Dreamshop` }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { sort, sub, brand, instock } = await searchParams

  const cat = CATEGORY_MAP[slug]
  if (!cat) notFound()

  let products = await getProducts(sub || undefined, cat.enum)

  if (brand) products = products.filter((p) => (p.brand ?? '').toLowerCase() === brand.toLowerCase())
  if (instock === '1') products = products.filter((p) => p.stock > 0)

  if (sort === 'price-asc')    products = [...products].sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price)
  else if (sort === 'bestsellers') products = [...products].sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller))

  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean) as string[])
  ).sort()

  return (
    <div className="mx-auto max-w-screen-xl px-5 pb-24 pt-[110px] sm:px-8">

      {/* Category nav strip */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {Object.entries(CATEGORY_MAP).map(([s, c]) => (
          <Link
            key={s}
            href={`/categories/${s}`}
            className={[
              'flex-shrink-0 rounded-full px-4 py-2 text-[11px] font-light transition-all',
              s === slug
                ? 'bg-[#1C1917] text-white'
                : 'border border-[#E8E0D8] bg-white text-[#78716C] hover:border-[#C9A882] hover:text-[#1C1917]',
            ].join(' ')}
          >
            {c.emoji} {c.label}
          </Link>
        ))}
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-[clamp(24px,3.5vw,38px)] font-light italic text-[#1C1917]">
          {cat.label}
        </h1>
        <p className="mt-1.5 text-[13px] font-light text-[#78716C]">{cat.description}</p>
      </div>

      {/* Subcategory + sort filters */}
      <Suspense>
        <CategoryPageFilters
          subcategories={cat.subcategories}
          brands={brands}
          productCount={products.length}
        />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  )
}
