'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Boxes,
  Users,
  Percent,
  Image,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
}

type NavSection = {
  title: string
  items: NavItem[]
}

const NAV: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard',  href: '/admin',            icon: LayoutDashboard, exact: true },
      { label: 'Products',   href: '/admin/products',   icon: Package                      },
      { label: 'Categories', href: '/admin/categories', icon: Tag                          },
      { label: 'Orders',     href: '/admin/orders',     icon: ShoppingBag                  },
    ],
  },
  {
    title: 'Store',
    items: [
      { label: 'Inventory',     href: '/admin/inventory',  icon: Boxes   },
      { label: 'Customers',     href: '/admin/customers',  icon: Users   },
      { label: 'Promotions',    href: '/admin/promotions', icon: Percent },
      { label: 'Media Library', href: '/admin/media',      icon: Image   },
    ],
  },
  {
    title: 'Config',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Accounts', href: '/admin/accounts', icon: Shield   },
    ],
  },
]

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-all duration-150',
        active
          ? 'text-white'
          : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'
      )}
    >
      {active && (
        <motion.span
          layoutId="sidebar-pill"
          className="absolute inset-0 rounded-md bg-white/10"
          transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      )}
      <item.icon
        size={14}
        strokeWidth={1.6}
        className={cn(
          'relative z-10 shrink-0 transition-colors',
          active ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'
        )}
      />
      <span className="relative z-10 font-light">{item.label}</span>
      {active && (
        <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-white/40" />
      )}
    </Link>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  function isActive(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-white/5 bg-neutral-950 px-4 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:text-neutral-200"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
        <p className="ml-3 text-[11px] font-light uppercase tracking-[0.3em] text-neutral-300">
          Dreamshop
        </p>
        <Link
          href="/"
          target="_blank"
          title="View store"
          className="ml-auto text-neutral-600 transition-colors hover:text-neutral-400"
        >
          <ExternalLink size={13} strokeWidth={1.5} />
        </Link>
      </div>

      {/* ── Backdrop ───────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-[220px] shrink-0 flex-col border-r border-white/5 bg-neutral-950 transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
          <div>
            <p className="text-[12px] font-light tracking-[0.3em] uppercase text-neutral-200">
              Dreamshop
            </p>
            <p className="mt-0.5 text-[10px] font-light text-neutral-600">Admin Panel</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-700 transition-colors hover:text-neutral-400"
              title="View store"
            >
              <ExternalLink size={12} strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-700 transition-colors hover:text-neutral-400 lg:hidden"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {NAV.map((section) => (
            <div key={section.title}>
              <p className="mb-1.5 px-3 text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-700">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isActive(item)}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 px-3 py-3">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-light text-neutral-600 transition-all duration-150 hover:bg-white/5 hover:text-neutral-400"
          >
            <LogOut size={14} strokeWidth={1.6} className="shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
