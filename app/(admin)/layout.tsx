import { AdminSidebar } from '@/components/admin/admin-sidebar'

// Admin pages are session-gated and always per-request — without this, Next.js
// probes them for static rendering at build time, hitting the DB and
// exhausting the Supabase pooler's session slots for no benefit.
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">{children}</main>
    </div>
  )
}
