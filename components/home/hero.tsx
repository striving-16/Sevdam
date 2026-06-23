'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  const ref  = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  /* Very gentle parallax — image drifts up slightly on scroll */
  const imageY   = useTransform(scrollYProgress, [0, 1], ['0%',  '12%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])
  const fade     = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex h-svh min-h-[640px] w-full overflow-hidden bg-white lg:h-screen"
      aria-label="Besma Sevdam — Luxury Beauty"
    >

      {/* ─── RIGHT — Founder photograph ──────────────────────────────────────
          Takes the entire right portion. No visible container.
          The left-edge gradient creates the editorial bleed effect.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 lg:left-[40%]">
        {/* Grain cinematic texture */}
        <div className="grain absolute inset-0 z-10" />

        {/* Warm gold atmospheric aura behind the portrait */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: [
              'radial-gradient(ellipse 65% 70% at 60% 35%, rgba(201,169,110,0.13) 0%, transparent 65%)',
              'radial-gradient(ellipse 40% 50% at 80% 80%, rgba(201,169,110,0.07) 0%, transparent 60%)',
            ].join(', '),
          }}
        />

        {/* Founder portrait with parallax */}
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

        {/* Horizontal white blend on left — seamless merge with text panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[45%] lg:w-[30%]"
          style={{ background: 'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.8) 50%, transparent 100%)' }}
        />

        {/* Bottom vignette — elegant fade at section bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-36"
          style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 100%)' }}
        />
      </div>

      {/* ─── LEFT — Brand content ────────────────────────────────────────────
          White panel with massive brand name + minimal copy.
          On mobile this sits below the image.
      ──────────────────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-20 flex w-full flex-col justify-end pb-14 pl-8 pr-8 pt-[78px] sm:pl-12 sm:pr-0 lg:w-[48%] lg:justify-center lg:pb-0 lg:pl-16 lg:pt-0 xl:pl-24"
      >
        {/* Thin gold rule — editorial accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          className="mb-7 hidden h-px w-14 origin-left bg-[#C9A96E] lg:block"
        />

        {/* Brand name — the hero element */}
        <h1 className="font-display leading-[0.87] tracking-[-0.01em] text-[#1A1714]">
          {['BESMA', 'SEVDAM'].map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                className={[
                  'block text-[clamp(58px,10.5vw,140px)] font-light',
                  i === 1 ? 'italic' : '',
                ].join(' ')}
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: 1.1,
                  delay: 0.2 + i * 0.12,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.72 }}
          className="mt-5 font-display text-[clamp(15px,1.8vw,20px)] font-light italic leading-[1.7] text-[#9E8E80] lg:max-w-[320px]"
        >
          Beauty Created to<br />Inspire Confidence
        </motion.p>

        {/* Pill CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Link href="/products" className="btn-pill-dark">
            Shop Collection
          </Link>
          <Link href="/products" className="btn-pill-outline">
            Explore Best Sellers
          </Link>
        </motion.div>

        {/* Scroll nudge — shown only on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 hidden items-center gap-3 lg:flex"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-10 w-px bg-[#C9A96E]"
          />
          <span className="text-[8px] font-light uppercase tracking-[0.38em] text-[#C9A96E]">
            Scroll
          </span>
        </motion.div>
      </motion.div>

      {/* Mobile gradient — makes text readable when image is behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[60%] lg:hidden"
        style={{ background: 'linear-gradient(to top, #ffffff 40%, rgba(255,255,255,0.85) 65%, transparent 100%)' }}
      />
    </section>
  )
}
