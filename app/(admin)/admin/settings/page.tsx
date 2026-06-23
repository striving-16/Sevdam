import { WHATSAPP_NUMBER, SOCIAL_LINKS } from '@/lib/config'

export const metadata = { title: 'Settings - Admin' }

function SettingRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-neutral-100 py-5 last:border-0">
      <div className="min-w-[180px]">
        <p className="text-[13px] font-normal text-neutral-700">{label}</p>
        {note && <p className="mt-0.5 text-[11px] font-light text-neutral-400">{note}</p>}
      </div>
      <p className="font-mono text-[12px] font-light text-neutral-500 break-all text-right">{value}</p>
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Settings</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">
          Store configuration overview
        </p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Store Info */}
        <div className="rounded-xl border border-neutral-100 bg-white px-6">
          <p className="border-b border-neutral-100 pb-4 pt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            Store Info
          </p>
          <SettingRow label="Store Name" value="[Configure in lib/config.ts]" />
          <SettingRow
            label="WhatsApp Number"
            value={`+${WHATSAPP_NUMBER}`}
            note="Used for customer orders"
          />
          <SettingRow label="Currency" value="[Configure in lib/config.ts]" />
          <SettingRow label="Country" value="[Configure in lib/config.ts]" />
        </div>

        {/* Social Links */}
        <div className="rounded-xl border border-neutral-100 bg-white px-6">
          <p className="border-b border-neutral-100 pb-4 pt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            Social Links
          </p>
          <SettingRow label="TikTok"    value={SOCIAL_LINKS.tiktok}   />
          <SettingRow label="Facebook"  value={SOCIAL_LINKS.facebook} />
        </div>

        {/* Database */}
        <div className="rounded-xl border border-neutral-100 bg-white px-6">
          <p className="border-b border-neutral-100 pb-4 pt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            System
          </p>
          <SettingRow label="Database"   value="PostgreSQL - Supabase"     />
          <SettingRow label="Images"     value="Cloudinary CDN"            />
          <SettingRow label="Deployment" value="Vercel"                    />
          <SettingRow label="Framework"  value="Next.js 16 (App Router)"   />
        </div>

        <p className="text-center text-[11px] font-light text-neutral-400">
          To update WhatsApp number or social links, edit{' '}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-neutral-600">
            lib/config.ts
          </code>
        </p>

      </div>
    </div>
  )
}
