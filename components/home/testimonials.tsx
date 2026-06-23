'use client'

import { motion } from 'framer-motion'

/*
  WHAT THEY SAY — pull-quote style testimonials.
  Warm champagne background. No dark cards.
  Think: editorial beauty magazine customer voices.
  Large quote text, very minimal layout.
*/

const QUOTES = [
  {
    text:    'The foundation is unlike anything I have tried. It feels like wearing nothing while looking completely flawless.',
    name:    'Sarah M.',
    detail:  'Loyal Customer · Riyadh',
    stars:   5,
  },
  {
    text:    'I opened the package and immediately felt the quality. The lipstick colour is exactly as beautiful as it looks online.',
    name:    'Layla K.',
    detail:  'Verified Buyer · Dubai',
    stars:   5,
  },
  {
    text:    'Besma Sevdam changed how I do my makeup. Everything looks more refined, more elevated. Truly luxury.',
    name:    'Amira T.',
    detail:  'Verified Buyer · Casablanca',
    stars:   5,
  },
]

export function Testimonials() {
  return (
    <section className="bg-[#F7F5F2] px-6 py-24 sm:px-10 sm:py-32 lg:px-14">

      {/* Section header */}
      <div className="mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C7A98B]"
        >
          What They Say
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7 }}
          className="font-display text-[clamp(32px,4.5vw,60px)] font-light italic leading-[0.95] text-[#111111]"
        >
          Loved By Thousands
        </motion.h2>

        {/* Gold stars aggregate */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
          className="mt-4 flex items-center justify-center gap-1.5"
        >
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[14px] text-[#C7A98B]">★</span>
          ))}
          <span className="ml-2 text-[11px] font-light text-[#8A8A8A]">4.9 · 2,400+ reviews</span>
        </motion.div>
      </div>

      {/* Pull quotes — stacked, centered, spacious */}
      <div className="mx-auto max-w-3xl space-y-1">
        {QUOTES.map((q, i) => (
          <motion.div
            key={q.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: i * 0.12 }}
            className="border-b border-[rgba(17,17,17,0.08)] py-10 last:border-none"
          >
            {/* Stars */}
            <div className={`mb-5 flex gap-0.5 ${i % 2 === 1 ? 'justify-end' : 'justify-start'}`}>
              {[...Array(q.stars)].map((_, j) => (
                <span key={j} className="text-[11px] text-[#C7A98B]">★</span>
              ))}
            </div>

            {/* Large quote text */}
            <p
              className={[
                'font-display text-[clamp(17px,2.2vw,26px)] font-light italic leading-[1.7] text-[#111111]',
                i % 2 === 1 ? 'text-right' : 'text-left',
              ].join(' ')}
            >
              &ldquo;{q.text}&rdquo;
            </p>

            {/* Attribution */}
            <div className={`mt-5 flex items-center gap-3 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
              <div
                className="h-px flex-1 bg-[rgba(17,17,17,0.08)]"
              />
              <div className={i % 2 === 1 ? 'text-right' : ''}>
                <p className="text-[11px] font-light text-[#111111]">{q.name}</p>
                <p className="text-[9.5px] font-light uppercase tracking-[0.18em] text-[#8A8A8A]">
                  {q.detail}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  )
}
