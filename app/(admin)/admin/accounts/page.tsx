import { getAdminUsers } from '@/actions/admin-user-actions'
import { AccountsPanel } from './accounts-panel'

export const metadata = { title: 'Admin Accounts' }

export default async function AccountsPage() {
  const users = await getAdminUsers()
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AccountsPanel users={users} />
    </div>
  )
}
