import { Percent } from 'lucide-react'

export const metadata = { title: 'Promotions â€” Admin' }

export default function AdminPromotionsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Promotions</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">Discount codes and sale campaigns</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-24 text-center">
        <Percent size={28} strokeWidth={1} className="mb-3 text-neutral-300" />
        <p className="text-[14px] font-light text-neutral-500">Promotions â€” Coming in Phase 3</p>
        <p className="mt-1.5 text-[12px] font-light text-neutral-400">
          Discount codes, percentage off, flash sales
        </p>
      </div>
    </div>
  )
}
