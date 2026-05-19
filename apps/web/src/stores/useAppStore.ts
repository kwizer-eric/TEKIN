import { create } from 'zustand'
import type {
  CashierOrderLine,
  CashierOrderRow,
  MenuItem,
  MenuKind,
} from '../data/fixtures'
import {
  CASHIER_ORDERS,
  DEFAULT_TABLES,
  MENU_ITEMS,
  STAFF,
  validateWaiterPin,
} from '../data/fixtures'

export type AppRole =
  | 'manager'
  | 'cashier'
  | 'waiter'
  | 'kitchen'

/** Kitchen must accept before prep countdown starts */
export type KitchenTicketStatus = 'incoming' | 'preparing' | 'ready'

export type KitchenTicket = {
  id: string
  orderNumber: string
  table: string
  items: string[]
  startedAt: number
  plannedPrepMs: number
  acceptedAt?: number
  prepDeadlineTs?: number
  status: KitchenTicketStatus
}

export type CartLine = {
  menuId: string
  name: string
  unitPriceRwf: number
  qty: number
  kind: MenuKind
  prepMinutes?: number
}

export type ShiftState = {
  openedAt: string
  expectedCashRwf: number
  declaredCashRwf: number
}

export type WaiterSession = {
  name: string
}

function initialTickets(): KitchenTicket[] {
  const now = Date.now()
  return [
    {
      id: 'kt-1',
      orderNumber: '#K210',
      table: '4',
      items: ['2× Brochette de boeuf'],
      startedAt: now - 8 * 60_000,
      plannedPrepMs: 14 * 60_000,
      status: 'incoming',
    },
    {
      id: 'kt-2',
      orderNumber: '#K209',
      table: '11',
      items: ['1× Tilapia grillé', '1× Isombe'],
      startedAt: now - 20 * 60_000,
      plannedPrepMs: 18 * 60_000,
      status: 'preparing',
      acceptedAt: now - 14 * 60_000,
      prepDeadlineTs: now + 4 * 60_000,
    },
    {
      id: 'kt-3',
      orderNumber: '#K208',
      table: '5',
      items: ['1× Ibirayi na poule'],
      startedAt: now - 28 * 60_000,
      plannedPrepMs: 16 * 60_000,
      status: 'ready',
      acceptedAt: now - 24 * 60_000,
      prepDeadlineTs: now - 8 * 60_000,
    },
  ]
}

function emptySalesByWaiter(): Record<string, number> {
  return Object.fromEntries(STAFF.waiters.map((w) => [w, 0]))
}

interface AppState {
  role: AppRole
  setRole: (role: AppRole) => void

  revenueTodayRwf: number
  activeOrders: number
  leakageRisk: number
  stockAlerts: number
  bumpMetrics: (opts: {
    revenue?: number
    orders?: number
    leakage?: number
    stockAlerts?: number
  }) => void

  kitchenTickets: KitchenTicket[]
  advanceKitchenTicket: (id: string) => void
  /** Move a ready ticket back to preparing (accidental bump). */
  revertKitchenTicket: (id: string) => void

  waiterSession: WaiterSession | null
  waiterLogin: (name: string, pin: string) => boolean
  waiterLogout: () => void

  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (id: string, patch: Partial<Omit<MenuItem, 'id'>>) => void
  removeMenuItem: (id: string) => void

  tables: string[]
  addTable: (table: string) => void
  updateTable: (from: string, to: string) => void
  removeTable: (table: string) => void

  waiterTable: string | null
  setWaiterTable: (table: string | null) => void
  waiterCart: CartLine[]
  addToCart: (menuId: string, qty?: number) => void
  setLineQty: (menuId: string, qty: number) => void
  removeLine: (menuId: string) => void
  resetWaiterFlow: () => void

  /** Running total of confirmed floor revenue per waiter this shift (demo). */
  salesConfirmedTodayByWaiter: Record<string, number>

  cashierOrders: CashierOrderRow[]
  confirmFloorOrder: (payload: { table?: string | null; lines: CartLine[] }) => void
  createCashierOrder: (payload: { table?: string | null; lines: CartLine[] }) => void
  markPaid: (id: string, method: 'Cash' | 'MoMo' | 'Card') => void
  completeWaiterHandover: (id: string) => void
  /** Mark every unpaid floor ticket for one waiter paid + hand-in complete (bulk balance match). */
  settleWaiterUnpaid: (waiterName: string) => void
  settleAllWaiterUnpaidAtEod: () => void

  shift: ShiftState
  updateDeclaredCash: (rwf: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  role: 'manager',
  setRole: (role) => set({ role }),

  revenueTodayRwf: 842_500,
  activeOrders: 14,
  leakageRisk: 34,
  stockAlerts: 3,
  bumpMetrics: (opts) =>
    set((s) => ({
      revenueTodayRwf: s.revenueTodayRwf + (opts.revenue ?? 0),
      activeOrders: Math.max(0, s.activeOrders + (opts.orders ?? 0)),
      leakageRisk: Math.min(
        100,
        Math.max(0, s.leakageRisk + (opts.leakage ?? 0)),
      ),
      stockAlerts: Math.max(0, s.stockAlerts + (opts.stockAlerts ?? 0)),
    })),

  kitchenTickets: initialTickets(),
  advanceKitchenTicket: (id) =>
    set((s) => ({
      kitchenTickets: s.kitchenTickets.map((t) => {
        if (t.id !== id) return t
        if (t.status === 'incoming') {
          const now = Date.now()
          return {
            ...t,
            status: 'preparing',
            acceptedAt: now,
            prepDeadlineTs: now + t.plannedPrepMs,
          }
        }
        if (t.status === 'preparing') return { ...t, status: 'ready' }
        return t
      }),
    })),
  revertKitchenTicket: (id) =>
    set((s) => ({
      kitchenTickets: s.kitchenTickets.map((t) => {
        if (t.id !== id || t.status !== 'ready') return t
        const acceptedAt = t.acceptedAt ?? Date.now() - t.plannedPrepMs
        const prepDeadlineTs = t.prepDeadlineTs ?? acceptedAt + t.plannedPrepMs
        return {
          ...t,
          status: 'preparing',
          acceptedAt,
          prepDeadlineTs,
        }
      }),
    })),

  waiterSession: null,
  waiterLogin: (name, pin) => {
    if (!validateWaiterPin(name, pin)) return false
    set({
      waiterSession: { name },
      waiterTable: null,
      waiterCart: [],
    })
    return true
  },
  waiterLogout: () =>
    set({
      waiterSession: null,
      waiterTable: null,
      waiterCart: [],
    }),

  menuItems: MENU_ITEMS.map((m) => ({ ...m })),
  addMenuItem: (item) =>
    set((s) => ({
      menuItems: [
        ...s.menuItems,
        {
          ...item,
          id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        },
      ],
    })),
  updateMenuItem: (id, patch) =>
    set((s) => ({
      menuItems: s.menuItems.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),
  removeMenuItem: (id) =>
    set((s) => ({
      menuItems: s.menuItems.filter((m) => m.id !== id),
      waiterCart: s.waiterCart.filter((l) => l.menuId !== id),
    })),

  tables: DEFAULT_TABLES,
  addTable: (table) =>
    set((s) => {
      const clean = table.trim()
      if (!clean || s.tables.includes(clean)) return {}
      return { tables: [...s.tables, clean] }
    }),
  updateTable: (from, to) =>
    set((s) => {
      const clean = to.trim()
      if (!clean || from === clean) return {}
      const alreadyExists = s.tables.includes(clean)
      if (alreadyExists) return {}
      return {
        tables: s.tables.map((t) => (t === from ? clean : t)),
        waiterTable: s.waiterTable === from ? clean : s.waiterTable,
        cashierOrders: s.cashierOrders.map((o) =>
          o.table === from ? { ...o, table: clean } : o,
        ),
      }
    }),
  removeTable: (table) =>
    set((s) => ({
      tables: s.tables.filter((t) => t !== table),
      waiterTable: s.waiterTable === table ? null : s.waiterTable,
      cashierOrders: s.cashierOrders.map((o) =>
        o.table === table ? { ...o, table: undefined } : o,
      ),
      kitchenTickets: s.kitchenTickets.map((t) =>
        t.table === table ? { ...t, table: 'No table' } : t,
      ),
    })),

  waiterTable: null,
  setWaiterTable: (table) => set({ waiterTable: table }),
  waiterCart: [],
  addToCart: (menuId, qty = 1) => {
    const item = get().menuItems.find((m) => m.id === menuId)
    if (!item) return
    set((s) => {
      const existing = s.waiterCart.find((l) => l.menuId === menuId)
      if (existing) {
        return {
          waiterCart: s.waiterCart.map((l) =>
            l.menuId === menuId ? { ...l, qty: l.qty + qty } : l,
          ),
        }
      }
      return {
        waiterCart: [
          ...s.waiterCart,
          {
            menuId,
            name: item.name,
            unitPriceRwf: item.priceRwf,
            qty,
            kind: item.kind,
            prepMinutes: item.prepMinutes,
          },
        ],
      }
    })
  },
  setLineQty: (menuId, qty) =>
    set((s) => ({
      waiterCart:
        qty <= 0
          ? s.waiterCart.filter((l) => l.menuId !== menuId)
          : s.waiterCart.map((l) =>
              l.menuId === menuId ? { ...l, qty } : l,
            ),
    })),
  removeLine: (menuId) =>
    set((s) => ({
      waiterCart: s.waiterCart.filter((l) => l.menuId !== menuId),
    })),
  resetWaiterFlow: () =>
    set({ waiterTable: null, waiterCart: [] }),

  salesConfirmedTodayByWaiter: emptySalesByWaiter(),

  cashierOrders: CASHIER_ORDERS.map((o) => ({ ...o })),
  confirmFloorOrder: ({ table, lines }) => {
    const session = get().waiterSession
    if (!session || lines.length === 0) return

    const total = lines.reduce(
      (sum, l) => sum + l.unitPriceRwf * l.qty,
      0,
    )
    const orderId = `W-${Date.now().toString(36).toUpperCase()}`
    const foodLines = lines.filter((l) => l.kind === 'food')
    const drinkLines = lines.filter((l) => l.kind !== 'food')

    const linesDetail: CashierOrderLine[] = lines.map((l) => ({
      name: l.name,
      qty: l.qty,
      kind: l.kind,
    }))

    const tableLabel = table?.trim() ? table.trim() : undefined
    const newCashier: CashierOrderRow = {
      id: orderId,
      channel: 'waiter',
      ...(tableLabel ? { table: tableLabel } : {}),
      totalRwf: total,
      placedByWaiterName: session.name,
      receivedAt: Date.now(),
      paid: false,
      lines: linesDetail,
      barQueuePriority: drinkLines.length > 0 && foodLines.length === 0,
    }

    set((s) => {
      let kitchenTickets = s.kitchenTickets
      if (foodLines.length > 0) {
        const itemsStr = foodLines.map((l) => `${l.qty}× ${l.name}`)
        const plannedPrepMs = Math.max(
          ...foodLines.map((l) => (l.prepMinutes ?? 14) * 60_000),
        )
        kitchenTickets = [
          {
            id: `KF-${Date.now().toString(36)}`,
            orderNumber: orderId,
            table: tableLabel ?? 'No table',
            items: itemsStr,
            startedAt: Date.now(),
            plannedPrepMs,
            status: 'incoming',
          },
          ...kitchenTickets,
        ]
      }

      const salesConfirmedTodayByWaiter = {
        ...s.salesConfirmedTodayByWaiter,
        [session.name]:
          (s.salesConfirmedTodayByWaiter[session.name] ?? 0) + total,
      }

      return {
        cashierOrders: [newCashier, ...s.cashierOrders],
        kitchenTickets,
        salesConfirmedTodayByWaiter,
      }
    })
  },
  createCashierOrder: ({ table, lines }) => {
    if (lines.length === 0) return
    const total = lines.reduce((sum, l) => sum + l.unitPriceRwf * l.qty, 0)
    const orderId = `C-${Date.now().toString(36).toUpperCase()}`
    const foodLines = lines.filter((l) => l.kind === 'food')
    const drinkLines = lines.filter((l) => l.kind !== 'food')
    const tableLabel = table?.trim() ? table.trim() : undefined
    const linesDetail: CashierOrderLine[] = lines.map((l) => ({
      name: l.name,
      qty: l.qty,
      kind: l.kind,
    }))

    set((s) => {
      let kitchenTickets = s.kitchenTickets
      if (foodLines.length > 0) {
        const itemsStr = foodLines.map((l) => `${l.qty}× ${l.name}`)
        const plannedPrepMs = Math.max(
          ...foodLines.map((l) => (l.prepMinutes ?? 14) * 60_000),
        )
        kitchenTickets = [
          {
            id: `KC-${Date.now().toString(36)}`,
            orderNumber: orderId,
            table: tableLabel ?? 'No table',
            items: itemsStr,
            startedAt: Date.now(),
            plannedPrepMs,
            status: 'incoming',
          },
          ...kitchenTickets,
        ]
      }
      const newCashier: CashierOrderRow = {
        id: orderId,
        channel: 'cashier',
        ...(tableLabel ? { table: tableLabel } : {}),
        totalRwf: total,
        receivedAt: Date.now(),
        paid: false,
        lines: linesDetail,
        barQueuePriority: drinkLines.length > 0 && foodLines.length === 0,
      }
      return {
        cashierOrders: [newCashier, ...s.cashierOrders],
        kitchenTickets,
      }
    })
  },
  markPaid: (id, method) =>
    set((s) => ({
      cashierOrders: s.cashierOrders.map((o) =>
        o.id === id && !o.paid
          ? {
              ...o,
              paid: true,
              method,
              ...(o.channel === 'waiter'
                ? { waiterHandoverComplete: false }
                : {}),
            }
          : o,
      ),
    })),
  completeWaiterHandover: (id) =>
    set((s) => ({
      cashierOrders: s.cashierOrders.map((o) =>
        o.id === id &&
        o.channel === 'waiter' &&
        o.paid &&
        !o.waiterHandoverComplete
          ? { ...o, waiterHandoverComplete: true }
          : o,
      ),
    })),
  settleWaiterUnpaid: (waiterName) =>
    set((s) => ({
      cashierOrders: s.cashierOrders.map((o) =>
        o.channel === 'waiter' &&
        !o.paid &&
        o.placedByWaiterName === waiterName
          ? {
              ...o,
              paid: true,
              method: 'Cash',
              waiterHandoverComplete: true,
            }
          : o,
      ),
    })),
  settleAllWaiterUnpaidAtEod: () =>
    set((s) => ({
      cashierOrders: s.cashierOrders.map((o) =>
        o.channel === 'waiter' && !o.paid
          ? {
              ...o,
              paid: true,
              method: 'Cash',
              waiterHandoverComplete: true,
            }
          : o,
      ),
    })),

  shift: {
    openedAt: '18:00',
    expectedCashRwf: 412_000,
    declaredCashRwf: 408_500,
  },
  updateDeclaredCash: (rwf) =>
    set((s) => ({ shift: { ...s.shift, declaredCashRwf: rwf } })),
}))
