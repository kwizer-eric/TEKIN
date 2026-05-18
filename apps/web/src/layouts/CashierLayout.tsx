import { ClipboardList, Clock, CreditCard, Wallet } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { ShellLayout } from './ShellLayout'
import type { TekinNavItem } from '@tekin/ui'

const CASHIER_NAV: TekinNavItem[] = [
  { path: '/cashier/orders', label: 'Live orders', icon: ClipboardList },
  { path: '/cashier/waiter-settle', label: 'Waiter balance', icon: Wallet },
  { path: '/cashier/payments', label: 'Reporting', icon: CreditCard },
  { path: '/cashier/shift', label: 'My shift', icon: Clock },
]

export function CashierLayout() {
  return (
    <ShellLayout
      navItems={CASHIER_NAV}
      title="Cashier"
      subtitle="Fast lane · Jean-Baptiste"
      sidebarRoleLabel="Cashier"
    >
      <Outlet />
    </ShellLayout>
  )
}
