'use client'

import { ShieldCheck, Tag, MessageCircle, RefreshCw, Truck, Users } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function TrustBar() {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'

  const ITEMS = [
    { icon: ShieldCheck, text: t.trustBar.authenticTitle },
    { icon: Tag,         text: t.trustBar.cleanTitle     },
    { icon: MessageCircle, text: t.trustBar.dermTitle   },
    { icon: RefreshCw,   text: t.trustBar.returnsTitle  },
    { icon: Truck,       text: t.trustBar.shippingTitle },
    { icon: Users,       text: t.trustBar.expertsTitle  },
  ]

  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden border-y border-[#E8E8ED] bg-[#F5F5F7] py-3">
      <div className={`animate-ticker ${isRtl ? '[animation-direction:reverse]' : ''}`}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap px-8">
            <item.icon size={11} strokeWidth={1.5} className="flex-shrink-0 text-[#1D1D1F]/40" />
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-[#6E6E73]">
              {item.text}
            </span>
            <span className="ml-5 text-[#BCBCBC]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
