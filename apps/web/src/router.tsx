import { CashierLayout } from './layouts/CashierLayout'
import { ConsumerLayout } from './layouts/ConsumerLayout'
import { RootLayout } from './layouts/RootLayout'
import { ManagerLayout } from './layouts/ShellLayout'
import { WaiterAppShell } from './layouts/WaiterAppShell'
import { CashierActivePage } from './pages/cashier/CashierActivePage'
import { CashierPaymentsPage } from './pages/cashier/CashierPaymentsPage'
import { CashierShiftPage } from './pages/cashier/CashierShiftPage'
import { ConsumerActivityPage } from './pages/consumer/ConsumerActivityPage'
import { ConsumerCreditPage } from './pages/consumer/ConsumerCreditPage'
import { ConsumerHomePage } from './pages/consumer/ConsumerHomePage'
import { KitchenBoardPage } from './pages/kitchen/KitchenBoardPage'
import { ManagerDashboard } from './pages/manager/ManagerDashboard'
import { ManagerSectionPlaceholder } from './pages/manager/ManagerSectionPlaceholder'
import { WaiterLoginPage } from './pages/waiter/WaiterLoginPage'
import { WaiterMyOrdersPage } from './pages/waiter/WaiterMyOrdersPage'
import { WaiterNewOrderPage } from './pages/waiter/WaiterNewOrderPage'
import { WaiterTablesPage } from './pages/waiter/WaiterTablesPage'
import { createBrowserRouter, Navigate } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/manager/dashboard" replace />,
      },
      {
        path: 'manager',
        element: <ManagerLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          {
            path: 'dashboard',
            handle: { title: 'Dashboard' },
            element: <ManagerDashboard />,
          },
          {
            path: 'orders',
            handle: { title: 'Orders' },
            element: (
              <ManagerSectionPlaceholder
                headline="Orders without noise"
                body="Every ticket stays labeled with table, risk, and payout path — TEKIN routes exceptions automatically."
              />
            ),
          },
          {
            path: 'kitchen',
            handle: { title: 'Kitchen view' },
            element: (
              <ManagerSectionPlaceholder
                headline="Kitchen telemetry"
                body="Watch dwell times without stepping into the hot line — drill into tickets when cadence slips."
              />
            ),
          },
          {
            path: 'stock',
            handle: { title: 'Stock' },
            element: (
              <ManagerSectionPlaceholder
                headline="Stock that respects chefs"
                body="Counts stay beside vendors — low cover triggers amber cards before you run out of Primus."
              />
            ),
          },
          {
            path: 'cashier',
            handle: { title: 'Cashier bridge' },
            element: (
              <ManagerSectionPlaceholder
                headline="Cashier oversight"
                body="Shift variance and MoMo retries bubble here — intervene before close, not after."
              />
            ),
          },
          {
            path: 'leakage',
            handle: { title: 'Leakage' },
            element: (
              <ManagerSectionPlaceholder
                headline="Leakage radar"
                body="Risk blends comps, voids, and split bills — TEKIN tells you where to coach tonight."
              />
            ),
          },
          {
            path: 'ai',
            handle: { title: 'AI Assistant' },
            element: (
              <ManagerSectionPlaceholder
                headline="AI partner mode"
                body="Ask in plain Kinyarwanda or French — TEKIN answers with venue-specific guardrails."
              />
            ),
          },
          {
            path: 'analytics',
            handle: { title: 'Analytics' },
            element: (
              <ManagerSectionPlaceholder
                headline="Analytics that earn time back"
                body="Margin story by shift, waiter, and SKU — export only when finance asks."
              />
            ),
          },
          {
            path: 'staff',
            handle: { title: 'Staff' },
            element: (
              <ManagerSectionPlaceholder
                headline="Staff roster"
                body="Skills, certifications, and overtime risk — tied to live sales pressure."
              />
            ),
          },
          {
            path: 'settings',
            handle: { title: 'Settings' },
            element: (
              <ManagerSectionPlaceholder
                headline="Venue controls"
                body="Tax profiles, printers, loyalty rails — calm toggles, instant audit trail."
              />
            ),
          },
        ],
      },
      {
        path: 'cashier',
        element: <CashierLayout />,
        children: [
          { index: true, element: <Navigate to="active" replace /> },
          {
            path: 'active',
            handle: { title: 'Orders & custody' },
            element: <CashierActivePage />,
          },
          {
            path: 'payments',
            handle: { title: 'Custody & reporting' },
            element: <CashierPaymentsPage />,
          },
          {
            path: 'shift',
            handle: { title: 'My Shift' },
            element: <CashierShiftPage />,
          },
        ],
      },
      {
        path: 'waiter',
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          {
            path: 'login',
            handle: { title: 'Sign in' },
            element: <WaiterLoginPage />,
          },
          {
            element: <WaiterAppShell />,
            children: [
              { index: true, element: <Navigate to="tables" replace /> },
              {
                path: 'tables',
                handle: { title: 'Tables' },
                element: <WaiterTablesPage />,
              },
              {
                path: 'new',
                handle: { title: 'New Order' },
                element: <WaiterNewOrderPage />,
              },
              {
                path: 'orders',
                handle: { title: 'My Orders' },
                element: <WaiterMyOrdersPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'kitchen',
        element: <KitchenBoardPage />,
      },
      {
        path: 'consumer',
        element: <ConsumerLayout />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          {
            path: 'home',
            handle: { title: 'Trust home' },
            element: <ConsumerHomePage />,
          },
          {
            path: 'activity',
            handle: { title: 'Activity' },
            element: <ConsumerActivityPage />,
          },
          {
            path: 'credit',
            handle: { title: 'Credit' },
            element: <ConsumerCreditPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/manager/dashboard" replace />,
      },
    ],
  },
])
