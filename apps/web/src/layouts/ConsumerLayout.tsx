import { Activity, ShieldCheck, Wallet } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import type { TekinNavItem } from '@tekin/ui'
import { ShellLayout } from './ShellLayout'

const CONSUMER_NAV: TekinNavItem[] = [
  { path: '/consumer/home', label: 'Trust', icon: ShieldCheck },
  { path: '/consumer/activity', label: 'Activity', icon: Activity },
  { path: '/consumer/credit', label: 'Credit', icon: Wallet },
]

export function ConsumerLayout() {
  return (
    <ShellLayout
      navItems={CONSUMER_NAV}
      title="Trust hub"
      subtitle="Measured fairness · TEKIN Consumer"
      sidebarRoleLabel="Verified patron"
    >
      <Outlet />
    </ShellLayout>
  )
}
