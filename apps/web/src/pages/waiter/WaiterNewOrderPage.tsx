/**
 * Screen: Waiter order builder — Menu-first flow with inline table pick + review/send.
 */
import { TekinBadge, TekinButton, TekinCard } from '@tekin/ui'
import { Check, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MENU_ITEMS, RESTAURANT, type MenuShelf } from '../../data/fixtures'
import { formatRwf } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

type Phase = 'menu' | 'review' | 'confirm'

const TABLES = Array.from({ length: 16 }, (_, i) => i + 1)

const SHELVES: { id: MenuShelf; label: string; hint: string }[] = [
  { id: 'liquor', label: 'Liquor', hint: 'Spirits · doubles' },
  { id: 'beer_soft', label: 'Beer & soft', hint: 'Beer · juices · soda' },
  { id: 'food', label: 'Food', hint: 'Kitchen · timed prep' },
]

export function WaiterNewOrderPage() {
  const navigate = useNavigate()
  const session = useAppStore((s) => s.waiterSession)
  const table = useAppStore((s) => s.waiterTable)
  const setTable = useAppStore((s) => s.setWaiterTable)
  const cart = useAppStore((s) => s.waiterCart)
  const addToCart = useAppStore((s) => s.addToCart)
  const setQty = useAppStore((s) => s.setLineQty)
  const resetFlow = useAppStore((s) => s.resetWaiterFlow)
  const confirmFloorOrder = useAppStore((s) => s.confirmFloorOrder)

  const [phase, setPhase] = useState<Phase>('menu')
  const [shelf, setShelf] = useState<MenuShelf>('liquor')

  const items = useMemo(
    () => MENU_ITEMS.filter((m) => m.shelf === shelf),
    [shelf],
  )

  const total = cart.reduce((sum, l) => sum + l.unitPriceRwf * l.qty, 0)
  const cartCount = cart.reduce((s, l) => s + l.qty, 0)

  const shelfMeta = SHELVES.find((s) => s.id === shelf)

  const goReview = () => {
    if (cart.length === 0) return
    setPhase('review')
  }

  const goConfirm = () => {
    if (!table || cart.length === 0) return
    setPhase('confirm')
  }

  const tableStrip = (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-tekin-gray-500">
          Table
        </p>
        {table != null ? (
          <TekinBadge status="healthy" label={`Cover · ${table}`} />
        ) : (
          <TekinBadge status="warning" label="Select table" />
        )}
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-0.5">
        {TABLES.map((n) => {
          const on = table === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => setTable(n)}
              className={`flex h-11 min-w-[3rem] shrink-0 items-center justify-center rounded-xl text-[15px] font-semibold transition-all duration-150 ${
                on
                  ? 'bg-tekin-emerald text-white shadow-md ring-2 ring-tekin-emerald ring-offset-2 ring-offset-tekin-white'
                  : 'border border-tekin-gray-200 bg-tekin-white text-tekin-gray-800 hover:border-tekin-emerald/50 hover:bg-tekin-gray-50'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )

  const phaseSteps = (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-tekin-gray-500">
      {(['Browse', 'Review', 'Send'] as const).map((label, i) => {
        const idx = phase === 'menu' ? 0 : phase === 'review' ? 1 : 2
        const done = i < idx
        const active = i === idx
        return (
          <span key={label} className="flex items-center gap-2">
            {i > 0 ? <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden /> : null}
            <span
              className={`rounded-full px-2.5 py-1 ${
                done
                  ? 'bg-tekin-emerald-light text-tekin-emerald'
                  : active
                    ? 'bg-tekin-navy text-white'
                    : 'bg-tekin-gray-100 text-tekin-gray-500'
              }`}
            >
              {done ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3" aria-hidden />
                  {label}
                </span>
              ) : (
                label
              )}
            </span>
          </span>
        )
      })}
    </div>
  )

  const showCartDock = cart.length > 0 && phase === 'menu'

  return (
    <div
      className={`flex flex-col gap-5 ${showCartDock ? 'pb-28' : 'pb-4'}`}
    >
      <div className="overflow-hidden rounded-2xl border border-tekin-gray-200 bg-gradient-to-br from-tekin-white via-tekin-emerald-light/25 to-tekin-white p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-tekin-gray-500">
              New round
            </p>
            <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-tekin-gray-900">
              {RESTAURANT.name}
            </h1>
            <p className="mt-1 text-[13px] text-tekin-gray-600">
              Signed in as{' '}
              <span className="font-semibold text-tekin-gray-900">{session?.name ?? '—'}</span>
            </p>
          </div>
          <div className="rounded-xl bg-tekin-white/80 px-3 py-2 backdrop-blur-sm">
            {phaseSteps}
          </div>
        </div>
        <div className="mt-5 border-t border-tekin-gray-200/80 pt-5">{tableStrip}</div>
      </div>

      {phase === 'menu' ? (
        <>
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-tekin-gray-500">
              Shelves
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SHELVES.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setShelf(tab.id)}
                  className={`flex min-h-[52px] min-w-[140px] shrink-0 flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all duration-150 ${
                    shelf === tab.id
                      ? 'border-tekin-navy bg-tekin-navy text-white shadow-md'
                      : 'border-tekin-gray-200 bg-tekin-white text-tekin-gray-800 hover:border-tekin-gray-300'
                  }`}
                >
                  <span className="text-[14px] font-semibold">{tab.label}</span>
                  <span
                    className={`mt-0.5 text-[11px] font-medium ${
                      shelf === tab.id ? 'text-white/80' : 'text-tekin-gray-500'
                    }`}
                  >
                    {tab.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-tekin-gray-900">
                {shelfMeta?.label ?? 'Menu'}
              </h2>
              <span className="text-[12px] text-tekin-gray-500">{shelfMeta?.hint}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addToCart(item.id)}
                  className="group flex min-h-[72px] flex-col items-stretch rounded-2xl border border-tekin-gray-100 bg-tekin-white p-4 text-left shadow-card transition-all duration-150 hover:border-tekin-emerald/40 hover:shadow-md active:scale-[0.99]"
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
          </div>
        </>
      ) : null}

      {phase === 'review' ? (
        <TekinCard className="flex flex-col gap-5 border-tekin-gray-200 shadow-card">
          {tableStrip}
          {!table ? (
            <p className="rounded-xl border border-tekin-amber bg-tekin-amber-light px-4 py-3 text-[13px] font-medium text-tekin-gray-800">
              Choose a table number above before sending — TEKIN routes tickets to the right cover.
            </p>
          ) : null}
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
              disabled={!table}
              onClick={goConfirm}
            >
              Continue to send
            </TekinButton>
          </div>
        </TekinCard>
      ) : null}

      {phase === 'confirm' && table ? (
        <TekinCard className="flex flex-col gap-5 border-tekin-navy/20 shadow-card">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Confirm · Table
              </p>
              <p className="text-[40px] font-semibold tabular-nums leading-none text-tekin-gray-900">
                {table}
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
                if (!table || cart.length === 0 || !session) return
                confirmFloorOrder({
                  table: String(table),
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

      {showCartDock ? (
        <div
          className="fixed left-0 right-0 z-30 border-t border-tekin-gray-200 bg-tekin-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md"
          style={{
            bottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4 md:max-w-3xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-tekin-gray-500">
                Round
              </p>
              <p className="text-[18px] font-semibold tabular-nums text-tekin-gray-900">
                {formatRwf(total)}
              </p>
              <p className="text-[12px] text-tekin-gray-600">{cartCount} units · tap items to add</p>
            </div>
            <TekinButton type="button" className="min-h-[48px] shrink-0 px-6" onClick={goReview}>
              Review
            </TekinButton>
          </div>
        </div>
      ) : null}
    </div>
  )
}
