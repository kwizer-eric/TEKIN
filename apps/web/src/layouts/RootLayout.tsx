import { LiveBootstrap } from '../components/LiveBootstrap'
import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <>
      <LiveBootstrap />
      <Outlet />
    </>
  )
}
