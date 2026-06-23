'use client'

import { useTranslation } from '@/lib/i18n/context'

const TRUST_ITEMS = [
  { icon: '◆', text: '100% Authentic Products'         },
  { icon: '◆', text: 'Luxury Beauty Crafted for You'   },
  { icon: '◆', text: 'Free Delivery Over 2000 MRU'    },
  { icon: '◆', text: 'Premium Quality Guaranteed'      },
  { icon: '◆', text: 'WhatsApp Order in Seconds'       },
  { icon: '◆', text: 'Dermatologist Approved'          },
  { icon: '◆', text: 'Easy Returns & Exchanges'        },
  { icon: '◆', text: 'New Arrivals Every Week'         },
]

export function TrustBar() {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const doubled = [...TRUST_ITEMS, ...TRUST_ITEMS]

  return (
    <div className="overflow-hidden border-y border-[#E8DDD2] bg-[#FDF8F3] py-3.5">
      <div className={`animate-ticker ${isRtl ? '[animation-direction:reverse]' : ''}`}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 whitespace-nowrap px-8"
          >
            <span className="text-[7px] text-[#D4AF37]">{item.icon}</span>
            <span className="text-[9px] font-light uppercase tracking-[0.28em] text-[#8A7E74]">
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
