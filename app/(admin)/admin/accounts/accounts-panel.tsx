'use client'

import { useActionState, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createAdminUser,
  deleteAdminUser,
  changeAdminPassword,
  type AdminActionResult,
} from '@/actions/admin-user-actions'

type AdminUser = { id: string; email: string; role: string }

// ─── Add Admin Form ───────────────────────────────────────────────────────────

function AddAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (prev: AdminActionResult | null, fd: FormData) => {
      const res = await createAdminUser(prev, fd)
      if ('success' in res) { router.refresh(); onSuccess() }
      return res
    },
    null,
  )

  return (
    <form action={action} className="mt-5 rounded-xl border border-neutral-100 bg-neutral-50 p-5">
      <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.1em] text-neutral-400">
        New admin account
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-light text-neutral-500">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[13px] font-light text-neutral-700 outline-none focus:border-neutral-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-light text-neutral-500">Password (min 8 chars)</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[13px] font-light text-neutral-700 outline-none focus:border-neutral-400"
          />
        </div>
      </div>
      {state && 'error' in state && (
        <p className="mt-3 text-[12px] text-red-500">{state.error}</p>
      )}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#1C1917] px-5 py-2 text-[11px] font-light uppercase tracking-[0.12em] text-white disabled:opacity-50"
        >
          {pending ? 'Creating…' : 'Create Admin'}
        </button>
        <button
          type="button"
          onClick={onSuccess}
          className="text-[11px] font-light text-neutral-400 hover:text-neutral-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Change Password Form ─────────────────────────────────────────────────────

function ChangePasswordForm({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (prev: AdminActionResult | null, fd: FormData) => {
      const res = await changeAdminPassword(prev, fd)
      if ('success' in res) { router.refresh(); onClose() }
      return res
    },
    null,
  )

  return (
    <form action={action} className="mt-2 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
      <input type="hidden" name="id" value={user.id} />
      <p className="mb-3 text-[11px] font-light text-neutral-500">New password for {user.email}</p>
      <div className="flex items-center gap-3">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="New password (min 8 chars)"
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[12px] font-light text-neutral-700 outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-neutral-800 px-4 py-2 text-[11px] font-light uppercase tracking-[0.1em] text-white disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onClose} className="text-[11px] text-neutral-400 hover:text-neutral-600">
          Cancel
        </button>
      </div>
      {state && 'error' in state && (
        <p className="mt-2 text-[12px] text-red-500">{state.error}</p>
      )}
      {state && 'success' in state && (
        <p className="mt-2 text-[12px] text-green-600">Password updated.</p>
      )}
    </form>
  )
}

// ─── Delete Button ────────────────────────────────────────────────────────────

function DeleteButton({ user }: { user: AdminUser }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    const fd = new FormData()
    fd.append('id', user.id)
    startTransition(async () => {
      const res = await deleteAdminUser(null, fd)
      if ('error' in res) { setError(res.error); setConfirm(false) }
      else router.refresh()
    })
  }

  if (confirm) {
    return (
      <span className="flex items-center gap-2">
        {error && <span className="text-[11px] text-red-500">{error}</span>}
        <button
          onClick={handleDelete}
          disabled={pending}
          className="text-[11px] font-normal text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          {pending ? 'Deleting…' : 'Confirm delete'}
        </button>
        <button onClick={() => { setConfirm(false); setError('') }} className="text-[11px] text-neutral-400">
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button onClick={() => setConfirm(true)} className="text-[11px] font-light text-neutral-400 hover:text-red-500">
      Delete
    </button>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function AccountsPanel({ users }: { users: AdminUser[] }) {
  const [showAdd, setShowAdd]         = useState(false)
  const [expandedId, setExpandedId]   = useState<string | null>(null)

  return (
    <div className="max-w-2xl">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Admin Accounts</h1>
          <p className="mt-1 text-[13px] font-light text-neutral-400">
            Manage who has access to this dashboard
          </p>
        </div>
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11px] font-light uppercase tracking-[0.12em] text-neutral-600 hover:border-neutral-400 hover:text-neutral-800"
          >
            + Add Admin
          </button>
        )}
      </div>

      {/* Account list */}
      <div className="rounded-xl border border-neutral-100 bg-white">
        <p className="border-b border-neutral-100 px-6 pb-4 pt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
          Accounts ({users.length})
        </p>

        {users.length === 0 && (
          <p className="px-6 py-10 text-center text-[13px] font-light text-neutral-400">
            No admin accounts found.
          </p>
        )}

        {users.map((user, i) => (
          <div key={user.id} className={`px-6 py-4 ${i < users.length - 1 || expandedId === user.id ? 'border-b border-neutral-100' : ''}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[12px] font-normal text-neutral-500">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-normal text-neutral-700">{user.email}</p>
                  <p className="text-[10px] font-light text-neutral-400">{user.role}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <button
                  onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                  className="text-[11px] font-light text-neutral-400 hover:text-neutral-700"
                >
                  {expandedId === user.id ? 'Cancel' : 'Change password'}
                </button>
                <DeleteButton user={user} />
              </div>
            </div>
            {expandedId === user.id && (
              <ChangePasswordForm user={user} onClose={() => setExpandedId(null)} />
            )}
          </div>
        ))}
      </div>

      {/* Add admin form */}
      {showAdd && (
        <AddAdminForm onSuccess={() => setShowAdd(false)} />
      )}

      <p className="mt-6 text-[11px] font-light text-neutral-400">
        Passwords are hashed with bcrypt and never stored in plain text.
      </p>
    </div>
  )
}
