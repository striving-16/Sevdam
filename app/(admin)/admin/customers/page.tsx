import { getCustomers } from '@/actions/customer-actions'
import { Users } from 'lucide-react'

export const metadata = { title: 'Customers â€” Admin' }

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Customers</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">
          {customers.length} registered customer{customers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-xl border border-neutral-100 bg-white py-20 text-center">
          <Users size={28} strokeWidth={1} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-[13px] font-light text-neutral-400">No customers yet.</p>
          <p className="mt-1.5 text-[12px] font-light text-neutral-400">
            Customers will appear here once orders come in.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Customer', 'Phone', 'Orders', 'Joined'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-600">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-normal text-neutral-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-[12px] font-light text-neutral-500">{c.phone}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[12px] font-light text-neutral-600">
                      {c.totalOrders}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[12px] font-light text-neutral-400">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
