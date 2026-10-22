'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Check, Pencil, X } from 'lucide-react'
import { updateWhatsAppNumber } from '@/actions/settings-actions'

export function WhatsAppSettingForm({ currentNumber }: { currentNumber: string | null }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentNumber ?? '')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-6 border-b border-neutral-100 py-5 last:border-0">
        <div className="min-w-[180px]">
          <p className="text-[13px] font-normal text-neutral-700">WhatsApp Number</p>
          <p className="mt-0.5 text-[11px] font-light text-neutral-400">Used for customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          {currentNumber ? (
            <p className="font-mono text-[12px] font-light text-neutral-500">+{currentNumber}</p>
          ) : (
            <p className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] text-red-600">Not configured</p>
          )}
          <button
            onClick={() => { setValue(currentNumber ?? ''); setEditing(true); setError(null) }}
            className="flex h-7 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-[11px] font-light text-neutral-600 hover:bg-neutral-50"
          >
            <Pencil size={11} strokeWidth={1.5} />
            Edit
          </button>
        </div>
      </div>
    )
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateWhatsAppNumber(value)
      if (result.error) { setError(result.error); return }
      toast.success('WhatsApp number updated')
      setEditing(false)
    })
  }

  return (
    <div className="border-b border-neutral-100 py-5 last:border-0">
      <p className="mb-2 text-[13px] font-normal text-neutral-700">WhatsApp Number</p>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 22236234567 (country code + number)"
          autoFocus
          className="h-9 flex-1 rounded-lg border border-neutral-200 bg-white px-3 font-mono text-[13px] text-neutral-800 outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
        />
        <button
          onClick={handleSave}
          disabled={pending}
          className="flex h-9 items-center gap-1 rounded-lg bg-neutral-900 px-3 text-[12px] text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          <Check size={12} strokeWidth={2} />
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="flex h-9 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-[12px] text-neutral-600 hover:bg-neutral-100"
        >
          <X size={12} strokeWidth={2} />
          Cancel
        </button>
      </div>
      {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
      <p className="mt-2 text-[11px] font-light text-neutral-400">
        Include the country code, no &quot;+&quot; or spaces (e.g. 22236234567).
      </p>
    </div>
  )
}
