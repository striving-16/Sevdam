'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function RoutineSection() {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  const STEPS = [
    { step: '01', label: t.routine.step1, tag: t.routine.step1Tag, desc: t.routine.step1Desc },
    { step: '02', label: t.routine.step2, tag: t.routine.step2Tag, desc: t.routine.step2Desc },
    { step: '03', label: t.routine.step3, tag: t.routine.step3Tag, desc: t.routine.step3Desc },
  ]

  return (
    <section className="bg-[#1C1917] py-28 sm:py-36 overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="mb-20 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end rtl:sm:flex-row-reverse">
          <div className="rtl:text-right">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 text-[10px] font-light uppercase text-[#C9A882]"
              style={{ letterSpacing: isRtl ? 0 : '0.4em' }}
            >
              {t.routine.eyebrow}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display text-[clamp(30px,4vw,54px)] font-light leading-[1.05] text-white"
            >
              {t.routine.title}
              <br />
              <span className="text-[#C9A882]">{t.routine.italic}</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-[12px] font-light tracking-wide text-white/45 transition-colors hover:text-white"
            >
              {t.routine.viewAll}
              <ArrowRight size={12} className={`transition-transform group-hover:translate-x-0.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0 rtl:sm:flex-row-reverse">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.13 }}
              className={`sm:border-t sm:border-white/10 sm:pt-8 sm:pb-0 ${
                i < STEPS.length - 1 ? 'sm:pr-10 rtl:sm:pr-0 rtl:sm:pl-10' : ''
              } ${i > 0 ? 'sm:pl-10 sm:border-l sm:border-white/10 rtl:sm:pl-0 rtl:sm:pr-10 rtl:sm:border-l-0 rtl:sm:border-r rtl:sm:border-white/10' : ''}`}
            >
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                <p className="font-display text-[72px] font-light leading-none text-white/[0.07]">
                  {step.step}
                </p>
                <span className="mt-3 inline-block rounded-full border border-white/[0.12] px-3 py-1 text-[9px] font-light uppercase text-white/40">
                  {step.tag}
                </span>
                <h3 className={`mt-4 font-display text-[30px] font-light text-white ${isRtl ? 'text-right' : ''}`}>
                  {step.label}
                </h3>
                <p className={`mt-3 text-[14px] font-light leading-[1.82] text-white/40 ${isRtl ? 'text-right' : ''}`}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex justify-center"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 px-8 py-4 text-[11px] font-light uppercase text-white transition-all duration-300 hover:border-[#C9A882] hover:text-[#C9A882]"
            style={{ letterSpacing: isRtl ? 0 : '0.15em' }}
          >
            {t.common.shopNow}
            <ArrowRight size={11} className={`transition-transform group-hover:translate-x-0.5 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
