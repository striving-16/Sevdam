'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'

const OFFERS = [
  {
    title: 'Buy 2 Get 1 Free',
    subtitle: 'On all skincare products',
    cta: 'Shop Skincare',
    href: '/categories/skincare',
    bg: 'bg-[#FDF6EE]',
    accent: '#C9A882',
  },
  {
    title: '20% Off Hair Care',
    subtitle: 'This week only — limited stock',
    cta: 'Shop Hair Care',
    href: '/categories/haircare',
    bg: 'bg-[#F0F7F4]',
    accent: '#6B9E8A',
  },
  {
    title: 'New Perfumes In',
    subtitle: 'Discover the latest fragrances',
    cta: 'Shop Perfumes',
    href: '/categories/perfumes',
    bg: 'bg-[#FDF0F5]',
    accent: '#C47A95',
  },
]

export function SpecialOffers() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">

        <div className="mb-10">
          <p className="mb-2 text-[10px] font-light uppercase tracking-[0.4em] text-[#C9A882]">
            Limited time
          </p>
          <h2 className="font-display text-[clamp(26px,3.5vw,40px)] font-light italic text-[#1C1917]">
            Special Offers
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={offer.href}
                className={`group flex flex-col justify-between rounded-2xl ${offer.bg} p-6 min-h-[160px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#1C1917]">{offer.title}</h3>
                    <p className="mt-1 text-[12px] font-light text-[#78716C]">{offer.subtitle}</p>
                  </div>
                  <Tag size={18} strokeWidth={1.5} style={{ color: offer.accent }} />
                </div>
                <span
                  className="mt-6 self-start rounded-full px-4 py-2 text-[11px] font-medium text-white transition-all group-hover:brightness-90"
                  style={{ backgroundColor: offer.accent }}
                >
                  {offer.cta} →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
