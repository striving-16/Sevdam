'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function BrandStatement() {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  const STATS = [
    { value: t.brand.s1Val, label: t.brand.s1Label },
    { value: t.brand.s2Val, label: t.brand.s2Label },
    { value: t.brand.s3Val, label: t.brand.s3Label },
    { value: t.brand.s4Val, label: t.brand.s4Label },
  ]

  return (
    <section className="relative overflow-hidden bg-[#1C1917] py-28 sm:py-36">

      {/* Decorative corner ornament */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] opacity-[0.035]"
        style={{ background: 'radial-gradient(circle at 100% 0%, #C9A882 0%, transparent 65%)' }}
      />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#C9A882]/10" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-[#C9A882]/10" />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Left: Copy */}
          <div className="rtl:text-right">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 flex items-center gap-3 text-[10px] font-light uppercase text-[#C9A882] rtl:flex-row-reverse"
              style={{ letterSpacing: isRtl ? 0 : '0.4em' }}
            >
              <span className="h-px w-8 bg-[#C9A882]" />
              {t.brand.eyebrow}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.85 }}
              className="font-display text-[clamp(32px,4.5vw,60px)] font-light leading-[1.08] text-white"
            >
              {t.brand.line1}{' '}
              <span className="text-[#C9A882]">{t.brand.italic}</span>
              <br />
              {t.brand.line2}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="mt-8 max-w-[420px] text-[15px] font-light leading-[1.85] text-white/45 rtl:max-w-none"
            >
              {t.brand.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 px-8 py-4 text-[11px] font-light uppercase text-white transition-all duration-300 hover:border-[#C9A882] hover:text-[#C9A882]"
                style={{ letterSpacing: isRtl ? 0 : '0.15em' }}
              >
                {t.brand.cta}
                <ArrowRight size={11} className={`transition-transform group-hover:translate-x-0.5 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </div>

          {/* Right: Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid grid-cols-2 gap-3"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-2xl border border-white/[0.06] p-7 rtl:text-right"
                style={{ backgroundColor: i >= 2 ? 'rgba(201,168,130,0.08)' : 'rgba(255,255,255,0.04)' }}
              >
                <p className="font-display text-[42px] font-light leading-none text-white">{stat.value}</p>
                <p className="mt-2 text-[11px] font-light uppercase text-white/35" style={{ letterSpacing: isRtl ? 0 : '0.18em' }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
