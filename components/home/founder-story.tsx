'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

/*
  THE STORY — brand manifesto section.
  This is NOT a product section. It's about who Besma Sevdam is.
  Design: full-width, asymmetric, editorial. Luxury fashion editorial feel.
*/

export function FounderStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section ref={ref} className="overflow-hidden" style={{ backgroundColor: '#E7E1DA' }}>

      {/* ── Full-width grid: text left, image right ── */}
      <div className="grid lg:grid-cols-[1fr_1fr] lg:min-h-[80vh]">

        {/* LEFT — brand manifesto */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="flex flex-col justify-center px-8 py-16 sm:px-10 sm:py-20 lg:px-10 lg:py-0 xl:px-14"
        >
          {/* Small label */}
          <p className="mb-6 text-[8.5px] font-light uppercase tracking-[0.5em] text-[#C7A98B]">
            Our Story
          </p>

          {/* Large editorial headline */}
          <h2 className="font-display text-[clamp(36px,5.5vw,72px)] font-light italic leading-[1.0] text-[#111111]">
            Beauty That<br />Speaks For Itself
          </h2>

          {/* Gold hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="mb-8 mt-8 h-px w-16 origin-left bg-[#C7A98B]"
          />

          {/* Story body */}
          <p className="text-[14px] font-light leading-[2] text-[#5A5A5A]">
            Born from a simple belief — that every woman deserves to feel extraordinary.
            Besma Sevdam was created to bring luxury beauty within reach, without
            ever compromising on quality or elegance.
          </p>

          {/* CTA — centered with arrow */}
          <div className="mt-10 flex justify-center">
            <Link href="/about" className="btn-pill-dark">
              Discover Our Story →
            </Link>
          </div>
        </motion.div>

        {/* RIGHT — editorial brand spread */}
        <div
          className="relative order-first h-[80vw] min-h-[380px] lg:order-last lg:h-auto"
          style={{ backgroundColor: '#FAFAF8' }}
        >
          {/* Subtle warm vignette at the edges — frames the white-bg image */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: [
                'linear-gradient(to right, rgba(231,225,218,0.35) 0%, transparent 18%)',
                'linear-gradient(to bottom, rgba(231,225,218,0.20) 0%, transparent 15%)',
                'linear-gradient(to bottom, transparent 80%, rgba(231,225,218,0.25) 100%)',
              ].join(', '),
            }}
          />

          {/* Editorial image — full composition with products */}
          <motion.div style={{ y: imageY }} className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/founder-story.jpeg"
              alt="Besma Sevdam — Founder with full product collection"
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Floating signature card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="absolute bottom-6 right-6 z-20 max-w-[180px] bg-[#111111]/90 px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-sm lg:bottom-10 lg:right-10"
          >
            <p className="font-display text-[12px] italic leading-[1.6] text-white/90">
              "Every woman deserves to feel extraordinary."
            </p>
            <p className="mt-2 text-[7.5px] font-light uppercase tracking-[0.3em] text-[#C7A98B]">
              Besma Sevdam
            </p>
          </motion.div>
        </div>

      </div>

    </section>
  )
}
