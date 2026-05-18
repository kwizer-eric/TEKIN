import { ClipboardList, Clock, CreditCard } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { ShellLayout } from './ShellLayout'
import type { TekinNavItem } from '@tekin/ui'

const CASHIER_NAV: TekinNavItem[] = [
  { path: '/cashier/active', label: 'Orders', icon: ClipboardList },
  { path: '/cashier/payments', label: 'Custody', icon: CreditCard },
  { path: '/cashier/shift', label: 'My Shift', icon: Clock },
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
