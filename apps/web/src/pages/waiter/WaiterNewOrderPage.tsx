/**
 * Screen: Waiter order builder — create, review, confirm, and send.
 */
import { TekinBadge, TekinButton, TekinCard } from '@tekin/ui'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatRwf } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

type Phase = 'menu' | 'review' | 'confirm'
type MenuView = 'drinks' | 'food'

const MENU_VIEWS: {
  id: MenuView
  label: string
  hint: string
  kinds: string[]
}[] = [
  {
    id: 'drinks',
    label: 'Drinks',
    hint: 'Liquor, beer, and soft drinks',
    kinds: ['liquor', 'beer', 'soft'],
  },
  {
    id: 'food',
    label: 'Food',
    hint: 'Kitchen items and meals',
    kinds: ['food'],
  },
]

export function WaiterNewOrderPage() {
  const navigate = useNavigate()
  const session = useAppStore((s) => s.waiterSession)
  const menuItems = useAppStore((s) => s.menuItems)
  const tables = useAppStore((s) => s.tables)
  const table = useAppStore((s) => s.waiterTable)
  const setTable = useAppStore((s) => s.setWaiterTable)
  const cart = useAppStore((s) => s.waiterCart)
  const addToCart = useAppStore((s) => s.addToCart)
  const setQty = useAppStore((s) => s.setLineQty)
  const resetFlow = useAppStore((s) => s.resetWaiterFlow)
  const confirmFloorOrder = useAppStore((s) => s.confirmFloorOrder)

  const [phase, setPhase] = useState<Phase>('menu')
  const [view, setView] = useState<MenuView>('drinks')
  const [query, setQuery] = useState('')

  const activeView = MENU_VIEWS.find((v) => v.id === view) ?? MENU_VIEWS[0]
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menuItems.filter((item) => {
      const inKind = activeView.kinds.includes(item.kind)
      if (!inKind) return false
      if (!q) return true
      return item.name.toLowerCase().includes(q)
    })
  }, [activeView.kinds, menuItems, query])

  const total = cart.reduce((sum, l) => sum + l.unitPriceRwf * l.qty, 0)
  const cartCount = cart.reduce((s, l) => s + l.qty, 0)

  const goReview = () => {
    if (cart.length === 0) return
    setPhase('review')
  }

  const goConfirm = () => {
    if (cart.length === 0) return
    setPhase('confirm')
  }

  const tableStrip = (
    <div className="rounded-xl border border-tekin-gray-200 bg-tekin-white p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-tekin-gray-500">
          Table (optional)
        </p>
        {table != null ? (
          <span className="rounded-full bg-tekin-emerald-light px-2 py-0.5 text-[10px] font-semibold text-tekin-emerald">
            {table}
          </span>
        ) : (
          <span className="rounded-full bg-tekin-gray-100 px-2 py-0.5 text-[10px] font-medium text-tekin-gray-600">
            None
          </span>
        )}
      </div>
      <div className="-mx-0.5 flex gap-1.5 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setTable(null)}
          className={`flex h-8 shrink-0 items-center justify-center rounded-lg px-2.5 text-[12px] font-semibold transition-all duration-150 ${
            table == null
              ? 'bg-tekin-navy text-white'
              : 'border border-tekin-gray-200 bg-tekin-white text-tekin-gray-800 hover:border-tekin-emerald/40'
          }`}
        >
          No table
        </button>
        {tables.map((label) => {
          const on = table === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => setTable(label)}
              className={`flex h-8 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg px-2.5 text-[12px] font-semibold transition-all duration-150 ${
                on
                  ? 'bg-tekin-emerald text-white'
                  : 'border border-tekin-gray-200 bg-tekin-white text-tekin-gray-800 hover:border-tekin-emerald/50'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 pb-4">
      {phase === 'menu' ? (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
          <TekinCard className="flex h-full min-h-0 flex-col gap-4">
            {tableStrip}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-tekin-gray-500">
                Categories
              </p>
              <div className="flex flex-col gap-2">
                {MENU_VIEWS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setView(tab.id)}
                    className={`flex min-h-[54px] flex-col items-start rounded-xl border px-3 py-2 text-left transition-all duration-150 ${
                      view === tab.id
                        ? 'border-tekin-navy bg-tekin-navy text-white'
                        : 'border-tekin-gray-200 bg-tekin-white text-tekin-gray-800 hover:border-tekin-gray-300'
                    }`}
                  >
                    <span className="text-[14px] font-semibold">{tab.label}</span>
                    <span className={`text-[11px] ${view === tab.id ? 'text-white/80' : 'text-tekin-gray-500'}`}>
                      {tab.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-auto rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">Current round</p>
              <p className="mt-1 text-xl font-semibold text-tekin-gray-900">{formatRwf(total)}</p>
              <p className="text-[12px] text-tekin-gray-600">{cartCount} item(s)</p>
              <TekinButton type="button" className="mt-3 w-full" disabled={cart.length === 0} onClick={goReview}>
                Review order
              </TekinButton>
            </div>
          </TekinCard>

          <TekinCard className="flex h-full min-h-0 flex-col">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-[16px] font-semibold text-tekin-gray-900">
                  {activeView.label}
                </h2>
                <p className="text-[12px] text-tekin-gray-600">{activeView.hint}</p>
              </div>
              <label className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tekin-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search menu"
                  className="w-full rounded-xl border border-tekin-gray-200 bg-tekin-white py-2 pl-9 pr-3 text-sm text-tekin-gray-900 outline-none focus:border-tekin-emerald"
                />
              </label>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-auto pr-1 sm:grid-cols-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addToCart(item.id)}
                  className="group flex min-h-[84px] flex-col rounded-2xl border border-tekin-gray-100 bg-tekin-white p-4 text-left shadow-card transition-all duration-150 hover:border-tekin-emerald/40 hover:shadow-md"
                >
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold leading-snug text-tekin-gray-900">
                        {item.name}
                      </p>
                      <p className="mt-1.5 text-[13px] font-medium text-tekin-gray-600">
                        {formatRwf(item.priceRwf)}
                        {item.kind === 'food' && item.prepMinutes != null ? (
                          <span className="text-tekin-gray-400">
                            {' '}
                            · ~{item.prepMinutes} min
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tekin-emerald-light text-tekin-emerald opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <span className="text-lg font-light leading-none">+</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </TekinCard>
        </div>
      ) : null}

      {phase === 'review' ? (
        <TekinCard className="flex flex-col gap-5 border-tekin-gray-200 shadow-card">
          {tableStrip}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Round total
              </p>
              <p className="text-[30px] font-semibold tabular-nums text-tekin-gray-900">
                {formatRwf(total)}
              </p>
            </div>
            <TekinBadge status="info" label={`${cartCount} units`} />
          </div>
          <ul className="flex flex-col gap-3">
            {cart.map((line) => (
              <li
                key={line.menuId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-tekin-gray-100 bg-tekin-gray-50/80 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-tekin-gray-900">{line.name}</p>
                  <p className="text-[13px] text-tekin-gray-600">
                    {formatRwf(line.unitPriceRwf)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-tekin-gray-200 bg-tekin-white text-lg font-semibold text-tekin-gray-800 shadow-sm"
                    onClick={() => setQty(line.menuId, line.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-lg font-semibold tabular-nums">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-tekin-gray-200 bg-tekin-white text-lg font-semibold text-tekin-gray-800 shadow-sm"
                    onClick={() => setQty(line.menuId, line.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <TekinButton type="button" variant="ghost" onClick={() => setPhase('menu')}>
              Back
            </TekinButton>
            <TekinButton
              type="button"
              className="min-h-[52px] flex-1"
              onClick={goConfirm}
            >
              Continue to send
            </TekinButton>
          </div>
        </TekinCard>
      ) : null}

      {phase === 'confirm' ? (
        <TekinCard className="flex flex-col gap-5 border-tekin-navy/20 shadow-card">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Confirm · Table
              </p>
              <p className="text-[40px] font-semibold tabular-nums leading-none text-tekin-gray-900">
                {table ?? 'No table'}
              </p>
            </div>
            <TekinBadge status="healthy" label="Ready to fire" />
          </div>
          <ul className="flex flex-col gap-2 border-y border-tekin-gray-100 py-4 text-sm text-tekin-gray-800">
            {cart.map((line) => (
              <li key={line.menuId} className="flex justify-between gap-3">
                <span>
                  {line.qty}× {line.name}
                </span>
                <span className="font-semibold tabular-nums">
                  {formatRwf(line.unitPriceRwf * line.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-tekin-gray-600">
              Guest pays
            </p>
            <p className="mt-1 text-[32px] font-semibold tabular-nums text-tekin-gray-900">
              {formatRwf(total)}
            </p>
          </div>
          <p className="text-[13px] leading-relaxed text-tekin-gray-600">
            Cashier sees this instantly; drinks hit the bar rail and food opens on the kitchen pass
            when the line accepts.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TekinButton type="button" variant="ghost" onClick={() => setPhase('review')}>
              Back
            </TekinButton>
            <TekinButton
              type="button"
              className="min-h-[56px] flex-1 text-[16px]"
              onClick={() => {
                if (cart.length === 0 || !session) return
                confirmFloorOrder({
                  table,
                  lines: cart.map((l) => ({ ...l })),
                })
                resetFlow()
                setPhase('menu')
                navigate('/waiter/orders')
              }}
            >
              Confirm & send order
            </TekinButton>
          </div>
        </TekinCard>
      ) : null}
    </div>
  )
}
