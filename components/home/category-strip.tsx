import Link from 'next/link'
import { Droplets, Scissors, Sparkles, Palette, Heart, User, Star, Wrench, ArrowUpRight } from 'lucide-react'

const CATEGORIES = [
  { slug: 'skincare', label: 'Skincare',     Icon: Droplets  },
  { slug: 'haircare', label: 'Hair Care',    Icon: Scissors  },
  { slug: 'perfumes', label: 'Perfumes',     Icon: Sparkles  },
  { slug: 'makeup',   label: 'Makeup',       Icon: Palette   },
  { slug: 'bodycare', label: 'Body Care',    Icon: Heart     },
  { slug: 'mencare',  label: "Men's Care",   Icon: User      },
  { slug: 'babycare', label: 'Baby Care',    Icon: Star      },
  { slug: 'tools',    label: 'Tools',        Icon: Wrench    },
]

export function CategoryStrip() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">

        <div className="mb-8">
          <p className="mb-1.5 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
            Explore
          </p>
          <h2 className="font-display text-[clamp(22px,3vw,34px)] font-light italic text-[#1C1917]">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 lg:grid-cols-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col items-center gap-2.5 rounded-xl border border-[#EBEBEB] bg-[#FAFAF8] px-2 py-4 text-center transition-all duration-200 hover:border-[#1C1917] hover:bg-[#1C1917] sm:py-5"
            >
              <ArrowUpRight
                size={10}
                strokeWidth={2}
                className="absolute right-2 top-2 text-[#C9C2BA] transition-colors duration-200 group-hover:text-white/60"
              />
              <cat.Icon
                size={18}
                strokeWidth={1.5}
                className="text-[#78716C] transition-colors duration-200 group-hover:text-white"
              />
              <span className="text-[9px] font-medium uppercase leading-tight tracking-[0.08em] text-[#1C1917] transition-colors duration-200 group-hover:text-white sm:text-[10px]">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
