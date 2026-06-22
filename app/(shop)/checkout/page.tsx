import { CheckoutForm } from '@/components/checkout/checkout-form'

export const metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white pt-[96px] lg:pt-[104px]">
      <div className="mx-auto max-w-screen-lg px-5 py-12 sm:px-8 sm:py-16">

        <div className="mb-10 border-b border-[#F0F0F0] pb-8">
          <p className="mb-2 text-[10px] font-light uppercase tracking-[0.38em] text-[#8A8A8E]">
            Checkout
          </p>
          <h1 className="font-display text-[clamp(28px,3.5vw,44px)] font-light tracking-[-0.02em] text-[#1D1D1F]">
            Checkout
          </h1>
        </div>

        <CheckoutForm />

      </div>
    </div>
  )
}
