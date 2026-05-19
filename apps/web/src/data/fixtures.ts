export const RESTAURANT = {
  name: 'Inzovu Lounge',
  address: 'KN 5 Rd, Kigali',
  currency: 'RWF',
} as const

export const STAFF = {
  manager: 'Claudine Uwimana',
  cashier: 'Jean-Baptiste Nzeyimana',
  waiters: ['Aline Mukamana', 'Eric Habimana', 'Grace Iradukunda'],
  kitchen: 'Chef Patrick Nkurunziza',
} as const

export type MenuKind = 'liquor' | 'beer' | 'soft' | 'food'

/** Primary shelf tabs on the waiter handset — keeps liquor / beer / food visually separated. */
export type MenuShelf = 'liquor' | 'beer_soft' | 'food'

export type MenuItem = {
  id: string
  name: string
  priceRwf: number
  shelf: MenuShelf
  kind: MenuKind
  /** Standard prep minutes — kitchen countdown uses the longest food line on the ticket */
  prepMinutes?: number
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'johnnie',
    name: 'Johnnie Walker Black · double',
    priceRwf: 12_500,
    shelf: 'liquor',
    kind: 'liquor',
  },
  {
    id: 'tiger',
    name: 'Tiger gin · double',
    priceRwf: 9000,
    shelf: 'liquor',
    kind: 'liquor',
  },
  {
    id: 'havana',
    name: 'Havana Club rum · double',
    priceRwf: 8500,
    shelf: 'liquor',
    kind: 'liquor',
  },
  {
    id: 'primus',
    name: 'Primus beer (500ml)',
    priceRwf: 1800,
    shelf: 'beer_soft',
    kind: 'beer',
  },
  {
    id: 'mutzig',
    name: 'Mutzig (500ml)',
    priceRwf: 2000,
    shelf: 'beer_soft',
    kind: 'beer',
  },
  {
    id: 'coke',
    name: 'Coca-Cola',
    priceRwf: 1000,
    shelf: 'beer_soft',
    kind: 'soft',
  },
  {
    id: 'jus',
    name: 'Jus de fruit maison',
    priceRwf: 2500,
    shelf: 'beer_soft',
    kind: 'soft',
  },
  {
    id: 'broche',
    name: 'Brochette de boeuf',
    priceRwf: 4500,
    shelf: 'food',
    kind: 'food',
    prepMinutes: 14,
  },
  {
    id: 'tilapia',
    name: 'Tilapia grillé',
    priceRwf: 7800,
    shelf: 'food',
    kind: 'food',
    prepMinutes: 18,
  },
  {
    id: 'frites',
    name: 'Frites maison',
    priceRwf: 2000,
    shelf: 'food',
    kind: 'food',
    prepMinutes: 8,
  },
  {
    id: 'ibirayi',
    name: 'Ibirayi na poule',
    priceRwf: 6500,
    shelf: 'food',
    kind: 'food',
    prepMinutes: 16,
  },
  {
    id: 'chapati',
    name: 'Chapati',
    priceRwf: 1200,
    shelf: 'food',
    kind: 'food',
    prepMinutes: 6,
  },
  {
    id: 'isombe',
    name: 'Isombe',
    priceRwf: 3500,
    shelf: 'food',
    kind: 'food',
    prepMinutes: 12,
  },
]

export const DEFAULT_TABLES: string[] = Array.from(
  { length: 16 },
  (_, i) => String(i + 1),
)

/** Demo PINs — replace with auth service in production */
export const WAITER_PIN_BY_NAME: Record<string, string> = Object.fromEntries(
  STAFF.waiters.map((w) => [w, '4242']),
)

export function validateWaiterPin(name: string, pin: string): boolean {
  const expected = WAITER_PIN_BY_NAME[name]
  return pin.length === 4 && expected !== undefined && pin === expected
}

export type DashboardInsight = {
  id: string
  severity: 'healthy' | 'warning' | 'critical' | 'info'
  title: string
  detail: string
}

export const AI_INSIGHTS: DashboardInsight[] = [
  {
    id: 'i1',
    severity: 'info',
    title: 'Friday demand is high',
    detail: 'Shift Primus + Mutzig cover early — you usually spike by 21:30.',
  },
  {
    id: 'i2',
    severity: 'warning',
    title: 'Stock is low',
    detail: 'Tilapia grillé crosses threshold tomorrow if tonight matches last Friday.',
  },
  {
    id: 'i3',
    severity: 'healthy',
    title: 'Kitchen pace is steady',
    detail: 'Prep-to-serve median is 11 minutes across the last hour.',
  },
  {
    id: 'i4',
    severity: 'critical',
    title: 'Cash mismatch risk',
    detail: 'Two split bills today ended short — watch MoMo confirmations.',
  },
]

export type LiveOrderFeedItem = {
  id: string
  label: string
  amountRwf: number
  table: string
  status: 'healthy' | 'warning' | 'info'
  ts: number
}

export const INITIAL_LIVE_FEED: LiveOrderFeedItem[] = [
  {
    id: 'o1',
    label: 'Order #204',
    amountRwf: 34_500,
    table: '7',
    status: 'healthy',
    ts: Date.now() - 120_000,
  },
  {
    id: 'o2',
    label: 'Order #205',
    amountRwf: 18_200,
    table: '3',
    status: 'info',
    ts: Date.now() - 210_000,
  },
  {
    id: 'o3',
    label: 'Order #206',
    amountRwf: 9200,
    table: '12',
    status: 'warning',
    ts: Date.now() - 420_000,
  },
]

export type TopSeller = { name: string; orders: number; revenueRwf: number }

export const TOP_SELLERS: TopSeller[] = [
  { name: 'Primus beer (500ml)', orders: 42, revenueRwf: 75_600 },
  { name: 'Brochette de boeuf', orders: 31, revenueRwf: 139_500 },
  { name: 'Tilapia grillé', orders: 18, revenueRwf: 140_400 },
  { name: 'Isombe', orders: 24, revenueRwf: 84_000 },
]

export type KitchenPerfSlice = { name: string; minutes: number }

export const KITCHEN_PERF: KitchenPerfSlice[] = [
  { name: 'Grill', minutes: 12 },
  { name: 'Local', minutes: 14 },
  { name: 'Sides', minutes: 7 },
  { name: 'Drinks', minutes: 4 },
]

/** How the guest placed / paid — drives cashier custody vs waiter hold. */
export type CashierOrderChannel =
  | 'waiter'
  | 'cashier'
  | 'online'
  | 'nearby'
  | 'table_qr'

export type CashierOrderLine = {
  name: string
  qty: number
  kind: MenuKind
}

export type CashierOrderRow = {
  id: string
  channel: CashierOrderChannel
  totalRwf: number
  /** When the venue received the ticket */
  receivedAt: number
  table?: string
  /** For online / nearby — short routing hint */
  routeNote?: string
  /** Floor orders only — who tapped it in */
  placedByWaiterName?: string
  paid: boolean
  method?: 'Cash' | 'MoMo' | 'Card'
  /**
   * Waiter-channel only: guest paid at counter — cashier still confirms waiter handed takings in.
   */
  waiterHandoverComplete?: boolean
  /** Line breakdown for bar vs kitchen visibility */
  lines?: CashierOrderLine[]
  /** Drinks-only floor ticket — cashier prepares pours immediately */
  barQueuePriority?: boolean
}

function cashierSeedOrders(): CashierOrderRow[] {
  const now = Date.now()
  return [
    {
      id: '#212',
      channel: 'waiter',
      table: '3',
      totalRwf: 18_500,
      placedByWaiterName: 'Grace Iradukunda',
      receivedAt: now - 18 * 60_000,
      paid: false,
    },
    {
      id: '#211',
      channel: 'waiter',
      table: '8',
      totalRwf: 42_200,
      placedByWaiterName: 'Aline Mukamana',
      receivedAt: now - 42 * 60_000,
      paid: false,
    },
    {
      id: '#210',
      channel: 'waiter',
      table: '5',
      totalRwf: 27_800,
      placedByWaiterName: 'Eric Habimana',
      receivedAt: now - 55 * 60_000,
      paid: true,
      method: 'MoMo',
      waiterHandoverComplete: false,
    },
    {
      id: '#209',
      channel: 'table_qr',
      table: '6',
      totalRwf: 14_300,
      receivedAt: now - 63 * 60_000,
      paid: true,
      method: 'MoMo',
    },
    {
      id: 'OL-104',
      channel: 'online',
      routeNote: 'Pickup · Nyamirambo',
      totalRwf: 22_600,
      receivedAt: now - 74 * 60_000,
      paid: true,
      method: 'MoMo',
    },
    {
      id: 'NB-22',
      channel: 'nearby',
      routeNote: 'Nearby · KN 3 delivery rider',
      totalRwf: 31_400,
      receivedAt: now - 95 * 60_000,
      paid: true,
      method: 'Cash',
    },
    {
      id: '#206',
      channel: 'waiter',
      table: '12',
      totalRwf: 9200,
      placedByWaiterName: 'Grace Iradukunda',
      receivedAt: now - 120 * 60_000,
      paid: true,
      method: 'Cash',
      waiterHandoverComplete: true,
    },
  ]
}

export const CASHIER_ORDERS: CashierOrderRow[] = cashierSeedOrders()

export const CONSUMER_PROFILE = {
  displayName: 'Eric Habimana',
  trustScore: 78,
  creditLimitRwf: 150_000,
  balanceUsedRwf: 42_000,
} as const

export type TrustActivity = {
  id: string
  title: string
  detail: string
  ts: number
  tone: 'healthy' | 'info' | 'warning'
}

export const TRUST_ACTIVITY: TrustActivity[] = [
  {
    id: 't1',
    title: 'On-time repayment',
    detail: 'Bar tab at Inzovu Lounge cleared early.',
    ts: Date.now() - 7200_000,
    tone: 'healthy',
  },
  {
    id: 't2',
    title: 'Profile verified',
    detail: 'Phone + ID match confirmed.',
    ts: Date.now() - 26_000_000,
    tone: 'info',
  },
  {
    id: 't3',
    title: 'Soft limit reminder',
    detail: 'You are at 28% of monthly rhythm — still healthy.',
    ts: Date.now() - 50_000_000,
    tone: 'warning',
  },
]
