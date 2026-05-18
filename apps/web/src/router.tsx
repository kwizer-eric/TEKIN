import { CashierLayout } from './layouts/CashierLayout'
import { ConsumerLayout } from './layouts/ConsumerLayout'
import { RootLayout } from './layouts/RootLayout'
import { ManagerLayout } from './layouts/ShellLayout'
import { WaiterAppShell } from './layouts/WaiterAppShell'
import { CashierOrdersPage } from './pages/cashier/CashierOrdersPage'
import { CashierPaymentsPage } from './pages/cashier/CashierPaymentsPage'
import { CashierShiftPage } from './pages/cashier/CashierShiftPage'
import { CashierWaiterSettlePage } from './pages/cashier/CashierWaiterSettlePage'
import { ConsumerActivityPage } from './pages/consumer/ConsumerActivityPage'
import { ConsumerCreditPage } from './pages/consumer/ConsumerCreditPage'
import { ConsumerHomePage } from './pages/consumer/ConsumerHomePage'
import { KitchenBoardPage } from './pages/kitchen/KitchenBoardPage'
import { ManagerAiPage } from './pages/manager/ManagerAiPage'
import { ManagerAnalyticsPage } from './pages/manager/ManagerAnalyticsPage'
import { ManagerCashierPage } from './pages/manager/ManagerCashierPage'
import { ManagerDashboard } from './pages/manager/ManagerDashboard'
import { ManagerKitchenPage } from './pages/manager/ManagerKitchenPage'
import { ManagerLeakagePage } from './pages/manager/ManagerLeakagePage'
import { ManagerOrdersPage } from './pages/manager/ManagerOrdersPage'
import { ManagerSettingsPage } from './pages/manager/ManagerSettingsPage'
import { ManagerStaffPage } from './pages/manager/ManagerStaffPage'
import { ManagerStockPage } from './pages/manager/ManagerStockPage'
import { WaiterLoginPage } from './pages/waiter/WaiterLoginPage'
import { WaiterMyOrdersPage } from './pages/waiter/WaiterMyOrdersPage'
import { WaiterNewOrderPage } from './pages/waiter/WaiterNewOrderPage'
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
            element: <ManagerOrdersPage />,
          },
          {
            path: 'kitchen',
            handle: { title: 'Kitchen view' },
            element: <ManagerKitchenPage />,
          },
          {
            path: 'stock',
            handle: { title: 'Stock' },
            element: <ManagerStockPage />,
          },
          {
            path: 'cashier',
            handle: { title: 'Cashier bridge' },
            element: <ManagerCashierPage />,
          },
          {
            path: 'leakage',
            handle: { title: 'Leakage' },
            element: <ManagerLeakagePage />,
          },
          {
            path: 'ai',
            handle: { title: 'AI Assistant' },
            element: <ManagerAiPage />,
          },
          {
            path: 'analytics',
            handle: { title: 'Analytics' },
            element: <ManagerAnalyticsPage />,
          },
          {
            path: 'staff',
            handle: { title: 'Staff' },
            element: <ManagerStaffPage />,
          },
          {
            path: 'settings',
            handle: { title: 'Settings' },
            element: <ManagerSettingsPage />,
          },
        ],
      },
      {
        path: 'cashier',
        element: <CashierLayout />,
        children: [
          { index: true, element: <Navigate to="orders" replace /> },
          {
            path: 'active',
            element: <Navigate to="/cashier/orders" replace />,
          },
          {
            path: 'orders',
            handle: { title: 'Live orders' },
            element: <CashierOrdersPage />,
          },
          {
            path: 'waiter-settle',
            handle: { title: 'Waiter balance' },
            element: <CashierWaiterSettlePage />,
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
              { index: true, element: <Navigate to="new" replace /> },
              {
                path: 'tables',
                element: <Navigate to="/waiter/new" replace />,
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
