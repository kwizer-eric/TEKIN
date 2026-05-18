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
    <div className="flex min-h-screen flex-col bg-tekin-gray-50 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <div className="sticky top-0 z-10 border-b border-tekin-gray-200 bg-tekin-white">
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
                variant="ghost"
                className="gap-2 px-2 py-2 text-[12px] font-semibold uppercase tracking-wide text-tekin-gray-700"
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
                            : '/consumer/home',
                  )
                }}
              />
            </div>
          }
        />
      </div>

      <main className="flex-1 px-4 py-4 md:px-6">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-tekin-gray-200 bg-tekin-white px-3 pb-[env(safe-area-inset-bottom)] pt-2 md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = location.pathname.startsWith(tab.path)
            const primary = tab.primary
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold uppercase tracking-wide transition-colors duration-150 ${
                  primary
                    ? active
                      ? 'bg-tekin-emerald text-white'
                      : 'bg-tekin-emerald-light text-tekin-emerald'
                    : active
                      ? 'bg-tekin-gray-100 text-tekin-gray-900'
                      : 'text-tekin-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      <nav className="hidden border-t border-tekin-gray-200 bg-tekin-white px-6 py-3 md:block">
        <div className="mx-auto flex max-w-3xl justify-center gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = location.pathname.startsWith(tab.path)
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                  active
                    ? 'border-tekin-emerald bg-tekin-emerald-light text-tekin-emerald'
                    : 'border-tekin-gray-200 bg-tekin-white text-tekin-gray-800 hover:bg-tekin-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
