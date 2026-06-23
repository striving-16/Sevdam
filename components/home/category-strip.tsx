'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

/*
  THE COLLECTION — editorial portrait tiles.
  No icon grids. No category pills. No ecommerce look.
  Think: luxury fashion lookbook spread.
*/

const TILES = [
  {
    label:    'Lips',
    sub:      'Lipstick · Gloss · Liner',
    href:     '/categories/makeup',
    gradient: 'linear-gradient(160deg, #F5E6DC 0%, #E8C8B5 45%, #F9EEE6 100%)',
    accent:   '#D4A58A',
    num:      '01',
  },
  {
    label:    'Face',
    sub:      'Foundation · Blush · Powder',
    href:     '/categories/makeup',
    gradient: 'linear-gradient(160deg, #F0E6D8 0%, #DDD0BF 45%, #F7F0E8 100%)',
    accent:   '#C4A882',
    num:      '02',
  },
  {
    label:    'Eyes',
    sub:      'Eyeshadow · Mascara · Liner',
    href:     '/categories/makeup',
    gradient: 'linear-gradient(160deg, #E8E0F0 0%, #C8BEDC 45%, #F2EEF8 100%)',
    accent:   '#A898C4',
    num:      '03',
  },
  {
    label:    'Skincare',
    sub:      'Serums · Moisturisers · SPF',
    href:     '/categories/skincare',
    gradient: 'linear-gradient(160deg, #E2EDE2 0%, #C0D4C0 45%, #EEF4EE 100%)',
    accent:   '#98BC98',
    num:      '04',
  },
  {
    label:    'Accessories',
    sub:      'Brushes · Tools · Essentials',
    href:     '/categories/tools',
    gradient: 'linear-gradient(160deg, #EDE8E0 0%, #D4CCC0 45%, #F5F2EC 100%)',
    accent:   '#B4AA98',
    num:      '05',
  },
]

export function CategoryStrip() {
  return (
    <section className="bg-[#F7F5F2] px-6 py-24 sm:px-10 sm:py-32 lg:px-14">

      {/* Section header — editorial style */}
      <div className="mb-14 flex items-end justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C7A98B]"
          >
            The Collection
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="font-display text-[clamp(34px,5vw,64px)] font-light italic leading-[0.95] text-[#111111]"
          >
            Shop The Edit
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="hidden sm:block"
        >
          <Link
            href="/products"
            className="font-display text-[13px] italic text-[#C7A98B] underline underline-offset-4 decoration-[#C7A98B]/40 transition-all hover:decoration-[#C7A98B]"
          >
            View all →
          </Link>
        </motion.div>
      </div>

      {/* Portrait editorial tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: i * 0.08 }}
          >
            <Link href={tile.href} className="group block">

              {/* Portrait tile — no hard border, no icon */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '2/3' }}
              >
                {/* Gradient art */}
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ background: tile.gradient }}
                />

                {/* Section number — editorial feel */}
                <div className="absolute left-4 top-4 z-10">
                  <span className="font-display text-[11px] font-light italic text-white/60">
                    {tile.num}
                  </span>
                </div>

                {/* Category label centered */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <span
                    className="font-display text-[clamp(26px,3vw,42px)] font-light italic leading-none transition-all duration-500 group-hover:-translate-y-1"
                    style={{ color: tile.accent }}
                  >
                    {tile.label}
                  </span>
                  {/* Sub-label reveals on hover */}
                  <span className="mt-2 translate-y-2 text-[8.5px] font-light uppercase tracking-[0.22em] text-white/0 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/60 group-hover:opacity-100">
                    {tile.sub}
                  </span>
                </div>

                {/* Gold bottom line on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#C7A98B] scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                />

                {/* Arrow reveal */}
                <div className="absolute right-4 top-4 z-10 translate-x-2 opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100">
                  <span className="text-[12px] font-light text-white/70">→</span>
                </div>
              </div>

            </Link>
          </motion.div>
        ))}
      </div>

    </section>
  )
}
