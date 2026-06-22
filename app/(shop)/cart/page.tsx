import { CartContents } from '@/components/cart/cart-contents'
import { getServerT } from '@/lib/i18n/server'

export const metadata = { title: 'Cart' }

export default async function CartPage() {
  const { t, dir } = await getServerT()

  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-24 pt-[140px]" dir={dir}>
      <div className={`mb-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
        <p className="mb-2 text-[10px] font-light uppercase text-[#78716C]" style={{ letterSpacing: dir === 'rtl' ? 0 : '0.4em' }}>
          {t.cart.eyebrow}
        </p>
        <h1 className="font-display text-[clamp(28px,4vw,44px)] font-light text-[#1C1917]">
          {t.cart.title}
        </h1>
      </div>
      <CartContents />
    </div>
  )
}
