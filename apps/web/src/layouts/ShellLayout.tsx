import {
  TekinSidebar,
  TekinTopBar,
  type TekinNavItem,
  type TekinSidebarRole,
} from '@tekin/ui'
import type { ReactNode } from 'react'
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Brain,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import { RoleSwitcher } from '../components/RoleSwitcher'
import type { AppRole } from '../stores/useAppStore'
import { useAppStore } from '../stores/useAppStore'

const MANAGER_NAV: TekinNavItem[] = [
  { path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/manager/orders', label: 'Orders', icon: ClipboardList },
  { path: '/manager/kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { path: '/manager/stock', label: 'Stock', icon: Package },
  { path: '/manager/cashier', label: 'Cashier', icon: CreditCard },
  { path: '/manager/leakage', label: 'Leakage', icon: Shield, badge: '34' },
  { path: '/manager/ai', label: 'AI Assistant', icon: Brain },
  { path: '/manager/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/manager/staff', label: 'Staff', icon: Users },
  { path: '/manager/settings', label: 'Settings', icon: Settings },
]

function roleForSidebar(appRole: AppRole): TekinSidebarRole {
  if (appRole === 'consumer') return 'consumer'
  return appRole
}

export type ShellLayoutProps = {
  navItems: TekinNavItem[]
  /** Used when no child route sets `handle.title`. */
  title: string
  subtitle?: string
  sidebarRoleLabel?: string
  children?: ReactNode
}

export function ShellLayout({
  navItems,
  title,
  subtitle,
  sidebarRoleLabel,
  children,
}: ShellLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()
  const appRole = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)
  const waiterSession = useAppStore((s) => s.waiterSession)
  const matchTitle = [...matches]
    .reverse()
    .find((m) => {
      const h = m.handle as { title?: string } | undefined
      return typeof h?.title === 'string'
    })
  const pageTitle =
    (matchTitle?.handle as { title?: string } | undefined)?.title ?? title

  return (
    <div className="flex min-h-screen bg-tekin-gray-50">
      <TekinSidebar
        brandLabel="TEKIN"
        role={roleForSidebar(appRole)}
        roleBadge={sidebarRoleLabel ?? appRole}
        items={navItems}
        activePath={location.pathname}
        onNavigate={(path) => navigate(path)}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <TekinTopBar
          title={pageTitle}
          subtitle={subtitle}
          rightSlot={
            <RoleSwitcher
              value={appRole}
              onChange={(next) => {
                setRole(next)
                const dest =
                  next === 'manager'
                    ? '/manager/dashboard'
                    : next === 'cashier'
                      ? '/cashier/active'
                      : next === 'waiter'
                        ? waiterSession != null
                          ? '/waiter/tables'
                          : '/waiter/login'
                        : next === 'kitchen'
                          ? '/kitchen'
                          : '/consumer/home'
                navigate(dest)
              }}
            />
          }
        />
        <main className="flex-1 p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}

export function ManagerLayout() {
  return (
    <ShellLayout
      navItems={MANAGER_NAV}
      title="Overview"
      subtitle="Inzovu Lounge"
      sidebarRoleLabel="Manager · Claudine"
    />
  )
}
