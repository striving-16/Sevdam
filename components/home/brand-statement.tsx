'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

/*
  BRAND STATEMENT — editorial philosophy strip.
  Light ivory background. Three brand pillars.
  Creates a brand identity moment between category and product sections.
*/

const PILLARS = [
  {
    numeral: 'I',
    label: 'Craftsmanship',
    body: 'Every formula developed with master cosmetic chemists. No compromises, ever.',
  },
  {
    numeral: 'II',
    label: 'Confidence',
    body: 'Beauty is not about perfection. It is about how you feel when you walk into the room.',
  },
  {
    numeral: 'III',
    label: 'Elegance',
    body: 'Refined in every detail — from the texture of the product to the weight of the packaging.',
  },
]

export function BrandStatement() {
  return (
    <section className="overflow-hidden bg-white">

      {/* Gold hairline */}
      <div
        className="h-px"
        style={{ background: 'linear-gradient(to right, transparent, #C9A96E 30%, #C9A96E 70%, transparent)' }}
      />

      {/* Headline block */}
      <div className="px-6 pb-0 pt-20 text-center sm:px-10 lg:px-14">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C9A96E]"
        >
          Our Philosophy
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.08 }}
          className="mx-auto max-w-4xl font-display text-[clamp(30px,5.5vw,76px)] font-light italic leading-[1.05] text-[#1A1714]"
        >
          Luxury Cosmetics Crafted
          <br />
          For Confidence
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-[460px] text-[13.5px] font-light leading-[1.9] text-[#9E8E80]"
        >
          Designed with precision, elegance, and uncompromising quality
          for women who demand beauty without limits.
        </motion.p>
      </div>

      {/* Pillars */}
      <div className="mx-auto mt-16 max-w-screen-xl border-t border-[#EDE5DA] sm:grid sm:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="border-b border-[#EDE5DA] px-8 py-10 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:py-12 lg:px-12"
          >
            <p className="mb-4 font-display text-[13px] font-light italic text-[#C9A96E]">
              {pillar.numeral}
            </p>
            <h3 className="font-display text-[clamp(18px,2vw,24px)] font-light italic text-[#1A1714]">
              {pillar.label}
            </h3>
            <p className="mx-auto mt-3 max-w-[240px] text-[12.5px] font-light leading-[1.85] text-[#9E8E80]">
              {pillar.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
        className="flex justify-center pb-20 pt-12"
      >
        <Link href="/products" className="btn-pill-dark">
          Explore The Collection
        </Link>
      </motion.div>

    </section>
  )
}
