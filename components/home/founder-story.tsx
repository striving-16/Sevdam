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
          className="flex flex-col justify-center px-8 py-20 sm:px-12 sm:py-24 lg:px-16 lg:py-0 xl:px-24"
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
          <div className="space-y-5 text-[14px] font-light leading-[2] text-[#5A5A5A]">
            <p>
              Born from a simple belief — that every woman deserves to feel extraordinary.
              Besma Sevdam was created to bring luxury beauty within reach, without
              ever compromising on quality or elegance.
            </p>
            <p>
              Every formula is meticulously crafted. Every shade is chosen with intention.
              Every product is an invitation to feel powerful, beautiful, and completely
              yourself.
            </p>
          </div>

          {/* Large italic quote — the brand voice */}
          <blockquote className="mt-10 border-l-2 border-[#C7A98B] pl-6">
            <p className="font-display text-[clamp(18px,2.2vw,26px)] font-light italic leading-[1.6] text-[#111111]">
              "Luxury is not a price. It is a feeling."
            </p>
            <footer className="mt-3">
              <p className="font-display text-[14px] italic text-[#C7A98B]">
                — Besma Sevdam
              </p>
            </footer>
          </blockquote>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/about" className="btn-pill-dark self-start">
              Discover Our Story
            </Link>
          </div>
        </motion.div>

        {/* RIGHT — founder portrait */}
        <div className="relative order-first h-[60vw] min-h-[340px] lg:order-last lg:h-auto">
          {/* Grain texture */}
          <div className="grain absolute inset-0 z-10" />

          {/* Atmospheric warm glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background: 'radial-gradient(ellipse 60% 55% at 45% 35%, rgba(201,169,110,0.10) 0%, transparent 65%)',
            }}
          />

          {/* Parallax image */}
          <motion.div style={{ y: imageY }} className="absolute inset-0">
            <Image
              src="/images/founder.jpeg"
              alt="Besma Sevdam — Founder"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Floating signature card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="absolute bottom-8 left-8 z-20 max-w-[190px] bg-white/90 px-5 py-4 shadow-[0_8px_32px_rgba(26,23,20,0.10)] backdrop-blur-sm"
          >
            <p className="font-display text-[12px] italic leading-[1.6] text-[#111111]">
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
