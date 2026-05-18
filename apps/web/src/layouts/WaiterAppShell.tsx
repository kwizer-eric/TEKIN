import { Navigate, Outlet } from 'react-router-dom'
import { WaiterLayout } from './WaiterLayout'
import { useAppStore } from '../stores/useAppStore'

/**
 * Protects waiter routes that require an authenticated floor session.
 */
export function WaiterAppShell() {
  const session = useAppStore((s) => s.waiterSession)
  if (!session) {
    return <Navigate to="/waiter/login" replace />
  }
  return (
    <WaiterLayout>
      <Outlet />
    </WaiterLayout>
  )
}
