'use client'

import { useTranslation } from '@/lib/i18n/context'

const WORDS = [
  'Beauty',
  'Confidence',
  'Elegance',
  'Femininity',
  'Luxury',
  'Timeless',
  'Besma Sevdam',
  'Crafted Beauty',
  'Sophistication',
]

export function BrandMarquee() {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const doubled = [...WORDS, ...WORDS]

  return (
    <div className="overflow-hidden border-y border-[#EDE5DA] bg-[#FDF9F4] py-4">
      <div
        className={`marquee-track ${isRtl ? '[animation-direction:reverse]' : ''}`}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            className="inline-flex items-center whitespace-nowrap"
          >
            <span className="px-6 font-display text-[13px] font-light italic text-[#9E8E80]">
              {word}
            </span>
            {/* Separator dot */}
            <span className="text-[8px] text-[#C9A96E]">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
