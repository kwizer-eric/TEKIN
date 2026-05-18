/**
 * Screen: Waiter order builder — Waiter — Liquor / beer / food lanes for speed.
 */
import { TekinBadge, TekinButton, TekinCard } from '@tekin/ui'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MENU_ITEMS, type MenuShelf } from '../../data/fixtures'
import { formatRwf } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

type Step = 1 | 2 | 3 | 4

const SHELVES: { id: MenuShelf; label: string }[] = [
  { id: 'liquor', label: 'Liquor' },
  { id: 'beer_soft', label: 'Beer & soft' },
  { id: 'food', label: 'Food' },
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

  const [step, setStep] = useState<Step>(table ? 2 : 1)
  const [shelf, setShelf] = useState<MenuShelf>('liquor')

  const items = useMemo(
    () => MENU_ITEMS.filter((m) => m.shelf === shelf),
    [shelf],
  )

  const total = cart.reduce((sum, l) => sum + l.unitPriceRwf * l.qty, 0)

  const goConfirm = () => {
    if (!table || cart.length === 0) return
    setStep(4)
  }

  const shelfLabel =
    SHELVES.find((s) => s.id === shelf)?.label ?? 'Menu'

  return (
    <div className="flex flex-col gap-4">
      <TekinCard padding="compact" className="border-tekin-gray-200">
        <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
          Serving as
        </p>
        <p className="mt-1 text-[15px] font-semibold text-tekin-gray-900">
          {session?.name ?? '—'}
        </p>
      </TekinCard>

      <ol className="flex flex-wrap gap-2 text-[12px] font-semibold uppercase tracking-wide text-tekin-gray-600">
        {(['Table', 'Menu', 'Order', 'Confirm'] as const).map((label, idx) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 ${
              step === idx + 1
                ? 'bg-tekin-emerald-light text-tekin-emerald'
                : 'bg-tekin-gray-100 text-tekin-gray-600'
            }`}
          >
            {idx + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 ? (
        <TekinCard>
          <p className="text-sm text-tekin-gray-600">
            Pick where this round lands — large tap targets on purpose.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className="min-h-[56px] rounded-xl border border-tekin-gray-200 bg-tekin-white text-lg font-semibold text-tekin-gray-900 hover:bg-tekin-gray-50"
                onClick={() => {
                  setTable(n)
                  setStep(2)
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </TekinCard>
      ) : null}

      {step === 2 ? (
        <TekinCard className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {SHELVES.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setShelf(tab.id)}
                className={`min-h-[44px] shrink-0 rounded-full px-4 text-[13px] font-semibold transition-colors duration-150 ${
                  shelf === tab.id
                    ? 'bg-tekin-navy text-white'
                    : 'bg-tekin-gray-100 text-tekin-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-tekin-gray-500">
            {shelfLabel}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addToCart(item.id)}
                className="flex min-h-[64px] items-center justify-between rounded-xl border border-tekin-gray-200 bg-tekin-white px-4 py-3 text-left hover:bg-tekin-gray-50"
              >
                <div>
                  <p className="text-[15px] font-semibold text-tekin-gray-900">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-tekin-gray-600">
                    {formatRwf(item.priceRwf)}
                    {item.kind === 'food' && item.prepMinutes != null ? (
                      <span className="ml-2 text-tekin-gray-500">
                        · ~{item.prepMinutes} min prep
                      </span>
                    ) : null}
                  </p>
                </div>
                <span className="h-3 w-3 rounded-full bg-tekin-emerald" aria-hidden />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <TekinButton type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </TekinButton>
            <TekinButton
              type="button"
              variant="secondary"
              onClick={() => setStep(3)}
              disabled={cart.length === 0}
            >
              Review order
            </TekinButton>
          </div>
        </TekinCard>
      ) : null}

      {step === 3 ? (
        <TekinCard className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Table
              </p>
              <p className="text-[28px] font-semibold text-tekin-gray-900">{table}</p>
            </div>
            <TekinBadge status="info" label="Not sent yet" />
          </div>
          <ul className="flex flex-col gap-3">
            {cart.map((line) => (
              <li
                key={line.menuId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-tekin-gray-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-tekin-gray-900">{line.name}</p>
                  <p className="text-[13px] text-tekin-gray-600">
                    {formatRwf(line.unitPriceRwf)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-tekin-gray-200 text-lg font-semibold"
                    onClick={() => setQty(line.menuId, line.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-lg font-semibold">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-tekin-gray-200 text-lg font-semibold"
                    onClick={() => setQty(line.menuId, line.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-tekin-gray-50 px-4 py-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
              Running total
            </p>
            <p className="mt-2 text-[32px] font-semibold text-tekin-gray-900">
              {formatRwf(total)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <TekinButton type="button" variant="ghost" onClick={() => setStep(2)}>
              Back
            </TekinButton>
            <TekinButton type="button" onClick={goConfirm}>
              Continue
            </TekinButton>
          </div>
        </TekinCard>
      ) : null}

      {step === 4 && table ? (
        <TekinCard className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
              Confirm for table
            </p>
            <p className="text-[34px] font-semibold text-tekin-gray-900">{table}</p>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-tekin-gray-800">
            {cart.map((line) => (
              <li key={line.menuId} className="flex justify-between gap-3">
                <span>
                  {line.qty}× {line.name}
                </span>
                <span className="font-semibold">
                  {formatRwf(line.unitPriceRwf * line.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-tekin-gray-200 px-4 py-4">
            <p className="text-[13px] text-tekin-gray-600">Guest pays</p>
            <p className="text-[32px] font-semibold text-tekin-gray-900">
              {formatRwf(total)}
            </p>
          </div>
          <p className="text-[13px] text-tekin-gray-600">
            Cashier sees this ticket instantly; food fires to the kitchen after they accept on the
            pass.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TekinButton type="button" variant="ghost" onClick={() => setStep(3)}>
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
                navigate('/waiter/orders')
              }}
            >
              Confirm order
            </TekinButton>
          </div>
        </TekinCard>
      ) : null}
    </div>
  )
}
