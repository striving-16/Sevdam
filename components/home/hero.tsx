'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  const ref  = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const imageY   = useTransform(scrollYProgress, [0, 1], ['0%',  '14%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const fade     = useTransform(scrollYProgress, [0, 0.45], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex h-svh min-h-[680px] w-full overflow-hidden"
      style={{ backgroundColor: '#E7E1DA' }}
      aria-label="Besma Sevdam — Luxury Beauty"
    >

      {/* ── BS Monogram Watermark — background luxury detail ───────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden select-none"
      >
        <span
          className="font-display font-light text-[#111111] select-none"
          style={{
            fontSize: 'clamp(320px, 55vw, 700px)',
            opacity: 0.028,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}
        >
          BS
        </span>
      </div>

      {/* ── RIGHT — Founder photograph ─────────────────────────────────────── */}
      <div className="absolute inset-0 lg:left-[42%]">
        {/* Grain */}
        <div className="grain absolute inset-0 z-10" />

        {/* Warm glow behind portrait */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: [
              'radial-gradient(ellipse 60% 65% at 55% 30%, rgba(199,169,139,0.18) 0%, transparent 65%)',
              'radial-gradient(ellipse 35% 45% at 80% 85%, rgba(199,169,139,0.08) 0%, transparent 60%)',
            ].join(', '),
          }}
        />

        {/* Portrait */}
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <Image
            src="/founder.jpeg"
            alt="Besma Sevdam"
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </motion.div>

        {/* Left edge blend — seamless merge with text panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[55%] lg:w-[35%]"
          style={{ background: 'linear-gradient(to right, #E7E1DA 0%, rgba(231,225,218,0.85) 45%, transparent 100%)' }}
        />

        {/* Bottom vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-32"
          style={{ background: 'linear-gradient(to top, rgba(231,225,218,0.6) 0%, transparent 100%)' }}
        />
      </div>

      {/* ── LEFT — Brand content ──────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-20 flex w-full flex-col justify-end pb-16 pl-8 pr-8 pt-[86px] sm:pl-14 sm:pr-0 lg:w-[50%] lg:justify-center lg:pb-0 lg:pl-16 lg:pt-0 xl:pl-28"
      >
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-7 hidden text-[8px] font-normal uppercase tracking-[0.55em] text-[#C7A98B] lg:block"
        >
          Luxury Cosmetics
        </motion.p>

        {/* Brand name — the primary hero element */}
        <h1 className="font-display leading-[0.88] tracking-[-0.01em] text-[#111111]">
          {[
            { word: 'BEAUTY', italic: false },
            { word: 'REFINED',  italic: true  },
          ].map(({ word, italic }, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                className={[
                  'block text-[clamp(52px,9.5vw,130px)] font-light',
                  italic ? 'italic' : '',
                ].join(' ')}
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: 1.15,
                  delay: 0.25 + i * 0.13,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Thin gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.76, 0, 0.24, 1] }}
          className="my-7 h-px w-12 origin-left bg-[#C7A98B]"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          className="text-[clamp(13px,1.5vw,16px)] font-light leading-[1.85] text-[#5A5A5A] lg:max-w-[300px]"
        >
          Luxury skincare and cosmetics designed<br className="hidden lg:block" />
          to enhance natural beauty and confidence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Link href="/products" className="btn-pill-dark">
            Shop Collection
          </Link>
          <Link href="/about" className="btn-pill-outline">
            Explore Brand
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-16 hidden items-center gap-3 lg:flex"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-10 w-px bg-[#C7A98B]"
          />
          <span className="text-[7.5px] font-normal uppercase tracking-[0.42em] text-[#C7A98B]">
            Scroll
          </span>
        </motion.div>
      </motion.div>

      {/* Mobile gradient — readability */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[55%] lg:hidden"
        style={{ background: 'linear-gradient(to top, #E7E1DA 35%, rgba(231,225,218,0.9) 60%, transparent 100%)' }}
      />
    </section>
  )
}
