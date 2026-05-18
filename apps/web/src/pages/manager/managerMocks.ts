/**
 * Demo fixtures for manager surfaces — replace with API wiring later.
 */

export type ManagerOrderRow = {
  id: string
  channel: 'Floor' | 'QR' | 'Online' | 'Nearby'
  table: string
  totalRwf: number
  phase: 'Open tab' | 'Kitchen' | 'Bar' | 'Settling' | 'Closed'
  waiter?: string
  minutesAgo: number
}

export const MANAGER_ORDERS: ManagerOrderRow[] = [
  {
    id: '#218',
    channel: 'Floor',
    table: '7',
    totalRwf: 34_500,
    phase: 'Kitchen',
    waiter: 'Aline Mukamana',
    minutesAgo: 4,
  },
  {
    id: '#217',
    channel: 'QR',
    table: '12',
    totalRwf: 18_200,
    phase: 'Closed',
    minutesAgo: 22,
  },
  {
    id: '#216',
    channel: 'Floor',
    table: '3',
    totalRwf: 52_800,
    phase: 'Bar',
    waiter: 'Grace Iradukunda',
    minutesAgo: 11,
  },
  {
    id: 'OL-118',
    channel: 'Online',
    table: '—',
    totalRwf: 26_400,
    phase: 'Open tab',
    minutesAgo: 31,
  },
  {
    id: '#215',
    channel: 'Nearby',
    table: 'Pickup',
    totalRwf: 41_000,
    phase: 'Settling',
    minutesAgo: 8,
  },
]

export type KitchenStationPulse = {
  id: string
  label: string
  tickets: number
  medianMin: number
  slaBreaches: number
  tone: 'healthy' | 'warning' | 'critical'
}

export const MANAGER_KITCHEN_STATIONS: KitchenStationPulse[] = [
  { id: 'hot', label: 'Hot line', tickets: 6, medianMin: 12, slaBreaches: 0, tone: 'healthy' },
  { id: 'cold', label: 'Cold / expo', tickets: 3, medianMin: 7, slaBreaches: 1, tone: 'warning' },
  { id: 'bar', label: 'Bar rail', tickets: 9, medianMin: 5, slaBreaches: 0, tone: 'healthy' },
]

export type StockLineMock = {
  sku: string
  category: string
  onHand: number
  par: number
  vendor: string
  status: 'ok' | 'low' | 'critical'
}

export const MANAGER_STOCK_LINES: StockLineMock[] = [
  {
    sku: 'Tilapia fillet',
    category: 'Proteins',
    onHand: 12,
    par: 28,
    vendor: 'Lake Fresh Co-op',
    status: 'critical',
  },
  {
    sku: 'Primus 500ml',
    category: 'Beer',
    onHand: 8,
    par: 48,
    vendor: 'BRALIRWA',
    status: 'low',
  },
  {
    sku: 'House jus blend',
    category: 'Bev prep',
    onHand: 22,
    par: 18,
    vendor: 'Nyabisinya farms',
    status: 'ok',
  },
  {
    sku: 'Cooking gas (kg)',
    category: 'Ops',
    onHand: 4,
    par: 6,
    vendor: 'K-Gas',
    status: 'low',
  },
]

export type CashierPulseMock = {
  shiftLabel: string
  drawerExpectedRwf: number
  drawerDeclaredRwf: number
  momoRetries: number
  splitsOpen: number
}

export const MANAGER_CASHIER_PULSE: CashierPulseMock = {
  shiftLabel: 'Fri · 18:00–02:00',
  drawerExpectedRwf: 612_400,
  drawerDeclaredRwf: 608_900,
  momoRetries: 3,
  splitsOpen: 2,
}

export type MoMoRetryMock = {
  id: string
  amountRwf: number
  guestMask: string
  reason: string
  ageMin: number
}

export const MANAGER_MOMO_RETRIES: MoMoRetryMock[] = [
  { id: 'mm-1', amountRwf: 34_500, guestMask: '+250 78•••441', reason: 'Timeout', ageMin: 6 },
  { id: 'mm-2', amountRwf: 12_000, guestMask: '+250 72•••902', reason: 'Insufficient funds', ageMin: 18 },
  { id: 'mm-3', amountRwf: 8_400, guestMask: '+250 79•••118', reason: 'PIN cancelled', ageMin: 42 },
]

export type LeakageIncidentMock = {
  id: string
  type: 'Void' | 'Comp' | 'Split drift' | 'Portion'
  amountRwf: number
  actor: string
  table: string
  risk: 'low' | 'medium' | 'high'
}

export const MANAGER_LEAKAGE_INCIDENTS: LeakageIncidentMock[] = [
  {
    id: 'L-901',
    type: 'Void',
    amountRwf: 9200,
    actor: 'Jean-Baptiste',
    table: '6',
    risk: 'medium',
  },
  {
    id: 'L-902',
    type: 'Comp',
    amountRwf: 4500,
    actor: 'Claudine',
    table: 'VIP-2',
    risk: 'low',
  },
  {
    id: 'L-903',
    type: 'Split drift',
    amountRwf: 2100,
    actor: 'System',
    table: '11',
    risk: 'high',
  },
  {
    id: 'L-904',
    type: 'Portion',
    amountRwf: 1800,
    actor: 'Kitchen',
    table: 'Pass',
    risk: 'low',
  },
]

export type AiPromptMock = {
  id: string
  label: string
  prompt: string
}

export const MANAGER_AI_PROMPTS: AiPromptMock[] = [
  {
    id: 'p1',
    label: 'Tonight cover',
    prompt: 'Summarize expected covers vs labour for the next four hours.',
  },
  {
    id: 'p2',
    label: 'Stock burn',
    prompt: 'Which three SKUs should we push on specials before Sunday?',
  },
  {
    id: 'p3',
    label: 'Leakage coach',
    prompt: 'Draft a 3-bullet coaching note for split-bill discipline.',
  },
]

export type AiReplyMock = {
  title: string
  bullets: string[]
}

export const MANAGER_AI_REPLY: Record<string, AiReplyMock> = {
  p1: {
    title: 'Cover vs labour',
    bullets: [
      'Forecasted covers climb from 42 now to ~78 by 21:30 — inline with last Friday.',
      'Floor labour is +1 waiter-hour vs plan; kitchen is −1 hour vs ideal prep buffer.',
      'Recommendation: hold the extra waiter until 22:00, then cut if cancellations stay below 4%.',
    ],
  },
  p2: {
    title: 'SKU rotation',
    bullets: [
      'Tilapia grillé is pacing 18% ahead of par burn — pair with citrus jus bundle tonight.',
      'Primus inventory crosses amber tomorrow if tonight matches trend — run bucket promo.',
      'Isombe portions are stable; skip discounting unless feedback mentions vegetarian gap.',
    ],
  },
  p3: {
    title: 'Coach note · splits',
    bullets: [
      'Confirm MoMo receipt on device before printing split chits.',
      'Never split after pour — ring drinks per seat first.',
      'Two drift events tonight were timing gaps; rehearse hand-off at pre-shift.',
    ],
  },
}

export type AnalyticsTrendPoint = {
  label: string
  revenueRwf: number
  covers: number
}

export const MANAGER_ANALYTICS_WEEK: AnalyticsTrendPoint[] = [
  { label: 'Mon', revenueRwf: 520_000, covers: 118 },
  { label: 'Tue', revenueRwf: 498_000, covers: 112 },
  { label: 'Wed', revenueRwf: 612_000, covers: 136 },
  { label: 'Thu', revenueRwf: 685_000, covers: 154 },
  { label: 'Fri', revenueRwf: 842_500, covers: 188 },
  { label: 'Sat', revenueRwf: 910_200, covers: 205 },
  { label: 'Sun', revenueRwf: 734_000, covers: 169 },
]

export type StaffRowMock = {
  name: string
  role: string
  shift: string
  overtimeRisk: 'low' | 'medium' | 'high'
  cert?: string
}

export const MANAGER_STAFF_ROWS: StaffRowMock[] = [
  {
    name: 'Claudine Uwimana',
    role: 'Manager',
    shift: 'Open · close',
    overtimeRisk: 'low',
    cert: 'Food safety · 2026',
  },
  {
    name: 'Jean-Baptiste Nzeyimana',
    role: 'Cashier',
    shift: '18:00 – 02:00',
    overtimeRisk: 'medium',
  },
  {
    name: 'Chef Patrick Nkurunziza',
    role: 'Kitchen lead',
    shift: '17:30 – 01:30',
    overtimeRisk: 'low',
    cert: 'HACCP',
  },
  {
    name: 'Aline Mukamana',
    role: 'Waiter',
    shift: '18:00 – 01:00',
    overtimeRisk: 'high',
  },
  {
    name: 'Eric Habimana',
    role: 'Waiter',
    shift: '18:30 – 01:30',
    overtimeRisk: 'low',
  },
  {
    name: 'Grace Iradukunda',
    role: 'Waiter',
    shift: '19:00 – 02:00',
    overtimeRisk: 'medium',
  },
]

export type SettingsGroupMock = {
  title: string
  items: { id: string; label: string; description: string; on: boolean }[]
}

export const MANAGER_SETTINGS_GROUPS: SettingsGroupMock[] = [
  {
    title: 'Service',
    items: [
      {
        id: 'qr',
        label: 'Table QR ordering',
        description: 'Guests can open tabs without waiter handshake.',
        on: true,
      },
      {
        id: 'auto_grat',
        label: 'Auto service charge · large parties',
        description: 'Applies to parties of 8+ after 20:00.',
        on: false,
      },
    ],
  },
  {
    title: 'Compliance',
    items: [
      {
        id: 'audit',
        label: 'Strict void approvals',
        description: 'Manager PIN required above 5,000 RWF.',
        on: true,
      },
      {
        id: 'receipt',
        label: 'E-receipt SMS',
        description: 'Send fiscal summary via SMS when MoMo succeeds.',
        on: true,
      },
    ],
  },
]
