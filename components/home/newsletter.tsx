'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function Newsletter() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#111111' }}
    >
      {/* Oversized BS watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display font-light text-white select-none"
          style={{
            fontSize: 'clamp(200px, 40vw, 560px)',
            opacity: 0.03,
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          BS
        </span>
      </div>

      {/* Gold top hairline */}
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(to right, transparent, #C7A98B 35%, #C7A98B 65%, transparent)',
        }}
      />

      <div className="relative mx-auto max-w-screen-xl px-6 py-24 text-center sm:px-10 sm:py-32 lg:px-14">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-5 text-[8px] font-normal uppercase tracking-[0.55em] text-[#C7A98B]"
        >
          Exclusive Access
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.8 }}
          className="font-display text-[clamp(36px,6vw,80px)] font-light italic leading-[0.92] text-white"
        >
          Join the<br />Beauty Circle
        </motion.h2>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="mx-auto my-8 h-px w-14 origin-center bg-[#C7A98B]"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18, duration: 0.7 }}
          className="mx-auto mb-12 max-w-[400px] text-[14px] font-light leading-[1.9] text-white/40"
        >
          Receive exclusive launches, beauty insights,<br className="hidden sm:block" />
          and special offers — curated for you.
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28, duration: 0.7 }}
          className="mx-auto max-w-md"
        >
          {submitted ? (
            <div className="flex flex-col items-center gap-4">
              {/* Animated tick */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C7A98B]/40"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <motion.path
                    d="M4 11.5L9 16.5L18 6"
                    stroke="#C7A98B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </svg>
              </motion.div>
              <p className="font-display text-[18px] italic text-white/80">
                Welcome to the circle.
              </p>
              <p className="text-[12px] font-light text-white/30">
                Check your inbox for a warm welcome from Besma.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="h-[50px] flex-1 rounded-full border border-white/10 bg-white/5 px-6 text-[13px] font-light text-white placeholder:text-white/25 outline-none transition-colors duration-300 focus:border-[#C7A98B]/50 focus:bg-white/8"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="h-[50px] flex-shrink-0 rounded-full bg-[#C7A98B] px-8 text-[10px] font-normal uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#D8C3A5] hover:text-[#111111] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Joining…
                  </span>
                ) : 'Subscribe'}
              </button>
            </form>
          )}

          {!submitted && (
            <p className="mt-4 text-[10.5px] font-light text-white/20">
              No spam. Unsubscribe anytime.
            </p>
          )}
        </motion.div>

        {/* Micro stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-16 flex max-w-sm items-center justify-center gap-10"
        >
          {[
            { number: '12K+', label: 'Subscribers' },
            { number: '4.9★', label: 'Rating'      },
            { number: '100%', label: 'Authentic'   },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-[clamp(20px,2.5vw,28px)] font-light italic text-white/70">
                {stat.number}
              </p>
              <p className="mt-0.5 text-[9px] font-normal uppercase tracking-[0.28em] text-white/25">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
