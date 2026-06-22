'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'

export function Testimonials() {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  const REVIEWS = [
    {
      name: t.testimonials.r1Name,
      skin: t.testimonials.r1Skin,
      text: t.testimonials.r1Text,
      product: t.testimonials.r1Product,
      initials: isRtl ? 'س' : 'SM',
      rating: 5,
    },
    {
      name: t.testimonials.r2Name,
      skin: t.testimonials.r2Skin,
      text: t.testimonials.r2Text,
      product: t.testimonials.r2Product,
      initials: isRtl ? 'ل' : 'LK',
      rating: 5,
    },
    {
      name: t.testimonials.r3Name,
      skin: t.testimonials.r3Skin,
      text: t.testimonials.r3Text,
      product: t.testimonials.r3Product,
      initials: isRtl ? 'أ' : 'AT',
      rating: 5,
    },
  ]

  return (
    <section className="bg-[#F5F5F7] py-24 sm:py-32">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-[10px] font-light uppercase tracking-[0.42em] text-[#6E6E73]"
          >
            {t.testimonials.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="font-display text-[clamp(26px,3.5vw,46px)] font-light tracking-[-0.02em] text-[#1D1D1F]"
          >
            {t.testimonials.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 inline-flex items-center gap-2"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[12px] text-[#1D1D1F]">★</span>
              ))}
            </div>
            <span className="text-[12px] font-light text-[#6E6E73]">
              {t.testimonials.aggregate}
            </span>
          </motion.div>
        </div>

        {/* Review cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className={`flex flex-col rounded-2xl border border-[#E8E8ED] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${isRtl ? 'text-right' : ''}`}
            >
              {/* Stars */}
              <div className={`flex gap-0.5 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                {[...Array(review.rating)].map((_, j) => (
                  <span key={j} className="text-[11px] text-[#1D1D1F]">★</span>
                ))}
              </div>

              {/* Review text */}
              <p className="mt-4 flex-1 text-[13.5px] font-light leading-[1.8] text-[#3C3C3C]">
                {review.text}
              </p>

              {/* Product reviewed */}
              <div className={`mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-[#F5F5F7] px-3 py-1.5 ${isRtl ? 'self-end flex-row-reverse' : ''}`}>
                <span className="text-[9px] text-[#1D1D1F]">★</span>
                <span className="text-[10px] font-light text-[#6E6E73] line-clamp-1">
                  {review.product}
                </span>
              </div>

              {/* Reviewer */}
              <div className={`mt-4 flex items-center gap-3 border-t border-[#F0F0F0] pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1D1D1F] text-[10px] font-light text-white">
                  {review.initials}
                </div>
                <div className={isRtl ? 'text-right' : ''}>
                  <p className="text-[12px] font-medium text-[#1D1D1F]">{review.name}</p>
                  <p className="text-[10px] font-light text-[#8A8A8E]">
                    {review.skin} · {t.testimonials.verifiedBuyer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
