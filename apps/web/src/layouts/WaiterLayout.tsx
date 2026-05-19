import { TekinButton, TekinTopBar } from '@tekin/ui'
import { List, LogOut, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RoleSwitcher } from '../components/RoleSwitcher'
import type { AppRole } from '../stores/useAppStore'
import { useAppStore } from '../stores/useAppStore'

const tabs = [
  { path: '/waiter/new', label: 'New order', icon: Plus, primary: true },
  { path: '/waiter/orders', label: 'My orders', icon: List, primary: false },
] as const

export type WaiterLayoutProps = {
  children: ReactNode
}

export function WaiterLayout({ children }: WaiterLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const appRole = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)
  const session = useAppStore((s) => s.waiterSession)
  const waiterLogout = useAppStore((s) => s.waiterLogout)

  const waiterDest = session != null ? '/waiter/new' : '/waiter/login'

  return (
    <div className="flex min-h-screen flex-col bg-tekin-gray-50">
      <div className="sticky top-0 z-10">
        <div className="bg-tekin-white shadow-sm">
        <TekinTopBar
          title="Floor service"
          subtitle={
            session ? `Signed in · ${session.name}` : 'TEKIN waiter handset'
          }
          showAlerts={false}
          rightSlot={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <TekinButton
                type="button"
                variant="secondary"
                className="gap-2 border-tekin-gray-300 bg-tekin-gray-100 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-tekin-gray-900 shadow-sm hover:bg-tekin-gray-200"
                onClick={() => {
                  waiterLogout()
                  navigate('/waiter/login', { replace: true })
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </TekinButton>
              <RoleSwitcher
                value={appRole}
                onChange={(next: AppRole) => {
                  setRole(next)
                  navigate(
                    next === 'manager'
                      ? '/manager/dashboard'
                      : next === 'cashier'
                        ? '/cashier/orders'
                        : next === 'waiter'
                          ? waiterDest
                          : next === 'kitchen'
                            ? '/kitchen'
                            : '/manager/dashboard',
                  )
                }}
              />
            </div>
          }
        />
        </div>
        <nav
          className="mt-6 flex justify-end gap-2 px-4 pb-2 md:px-6"
          aria-label="Waiter sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = location.pathname.startsWith(tab.path)
            const primary = tab.primary
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-3 text-[12px] font-semibold uppercase tracking-wide transition-colors duration-150 md:min-w-[148px] ${
                  primary
                    ? active
                      ? 'bg-tekin-emerald text-white'
                      : 'bg-tekin-emerald-light text-tekin-emerald'
                    : active
                      ? 'bg-tekin-gray-100 text-tekin-gray-900'
                      : 'border border-tekin-gray-200 bg-tekin-white text-tekin-gray-700 hover:bg-tekin-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <main className="flex min-h-0 flex-1 flex-col px-4 py-4 md:px-6">{children}</main>
    </div>
  )
}

