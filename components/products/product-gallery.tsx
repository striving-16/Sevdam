'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductGalleryProps {
  imageUrl: string
  productName: string
}

export function ProductGallery({ imageUrl, productName }: ProductGalleryProps) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <div className="sticky top-24">
      <div
        className="relative overflow-hidden rounded-2xl bg-neutral-50 cursor-zoom-in"
        style={{ aspectRatio: '4/5' }}
        onClick={() => setZoomed(true)}
      >
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={imageUrl}
            alt={productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-2xl"
              style={{ aspectRatio: '4/5' }}
            >
              <Image
                src={imageUrl}
                alt={productName}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
