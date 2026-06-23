'use client'

import { motion } from 'framer-motion'
import type { Testimonial } from '@prisma/client'

export function TestimonialsList({ quotes }: { quotes: Testimonial[] }) {
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
        </motion.div>
      </div>

      {/* Pull quotes */}
      <div className="mx-auto max-w-3xl space-y-1">
        {quotes.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: i * 0.12 }}
            className="border-b border-[rgba(17,17,17,0.08)] py-10 last:border-none"
          >
            <div className={`mb-5 flex gap-0.5 ${i % 2 === 1 ? 'justify-end' : 'justify-start'}`}>
              {[...Array(q.stars)].map((_, j) => (
                <span key={j} className="text-[11px] text-[#C7A98B]">★</span>
              ))}
            </div>

            <p
              className={[
                'font-display text-[clamp(17px,2.2vw,26px)] font-light italic leading-[1.7] text-[#111111]',
                i % 2 === 1 ? 'text-right' : 'text-left',
              ].join(' ')}
            >
              &ldquo;{q.text}&rdquo;
            </p>

            <div className={`mt-5 flex items-center gap-3 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
              <div className="h-px flex-1 bg-[rgba(17,17,17,0.08)]" />
              <div className={i % 2 === 1 ? 'text-right' : ''}>
                <p className="text-[11px] font-light text-[#111111]">{q.name}</p>
                <p className="text-[9.5px] font-light uppercase tracking-[0.18em] text-[#8A8A8A]">{q.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  )
}
