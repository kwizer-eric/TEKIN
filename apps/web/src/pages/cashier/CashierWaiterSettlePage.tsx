/**
 * Screen: Waiter balance — Cashier — Pick a waiter, see unpaid tabs, settle in one match.
 */
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CashierOrderRow } from '../../data/fixtures'
import { STAFF } from '../../data/fixtures'
import { formatRwf, relativeOrAbsolute } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

export function CashierWaiterSettlePage() {
  const orders = useAppStore((s) => s.cashierOrders)
  const settleWaiterUnpaid = useAppStore((s) => s.settleWaiterUnpaid)

  const [selectedWaiter, setSelectedWaiter] = useState<string>(STAFF.waiters[0] ?? '')

  const rowsByWaiter = useMemo(() => {
    const map = new Map<string, CashierOrderRow[]>()
    for (const w of STAFF.waiters) {
      map.set(w, [])
    }
    orders
      .filter((o) => o.channel === 'waiter' && !o.paid)
      .forEach((o) => {
        const name = o.placedByWaiterName ?? 'Unknown'
        const list = map.get(name) ?? []
        list.push(o)
        map.set(name, list)
      })
    for (const [, list] of map) {
      list.sort((a, b) => b.receivedAt - a.receivedAt)
    }
    return map
  }, [orders])

  const totalsByWaiter = useMemo(() => {
    const out: Record<string, number> = {}
    for (const w of STAFF.waiters) {
      const list = rowsByWaiter.get(w) ?? []
      out[w] = list.reduce((s, o) => s + o.totalRwf, 0)
    }
    return out
  }, [rowsByWaiter])

  const venueUnpaidTotal = useMemo(
    () =>
      orders
        .filter((o) => o.channel === 'waiter' && !o.paid)
        .reduce((s, o) => s + o.totalRwf, 0),
    [orders],
  )

  const unpaidForSelected = rowsByWaiter.get(selectedWaiter) ?? []
  const selectedTotal = totalsByWaiter[selectedWaiter] ?? 0

  return (
    <div className="flex flex-col gap-4">
      <TekinCard className="border-tekin-emerald bg-tekin-emerald-light">
        <p className="text-[13px] font-semibold text-tekin-emerald">
          Waiter balance desk
        </p>
        <p className="mt-2 text-sm text-tekin-gray-800">
          Choose a waiter to see every <span className="font-semibold">open tab</span> still on
          the floor. When they hand you cash or MoMo for the full running balance, record one
          settlement — TEKIN marks every linked ticket paid and squared.
        </p>
        <p className="mt-3 text-[13px] text-tekin-gray-700">
          Need ticket-level detail?{' '}
          <Link
            to="/cashier/orders"
            className="font-semibold text-tekin-emerald underline-offset-2 hover:underline"
          >
            Open live orders
          </Link>
          .
        </p>
      </TekinCard>

      <TekinMetricCard
        label="Venue-wide · unpaid floor tabs"
        value={formatRwf(venueUnpaidTotal)}
        delta={{
          text:
            venueUnpaidTotal > 0
              ? 'Split per waiter below — settle where cash landed'
              : 'Nothing outstanding with waiters',
          tone: venueUnpaidTotal > 0 ? 'warning' : 'positive',
        }}
      />

      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <TekinCard className="h-fit">
          <h2 className="text-[15px] font-semibold text-tekin-gray-900">
            Waiters
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {STAFF.waiters.map((name) => {
              const due = totalsByWaiter[name] ?? 0
              const active = selectedWaiter === name
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => setSelectedWaiter(name)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-colors duration-150 ${
                      active
                        ? 'border-tekin-emerald bg-tekin-emerald-light'
                        : 'border-tekin-gray-200 bg-tekin-white hover:bg-tekin-gray-50'
                    }`}
                  >
                    <span className="text-sm font-semibold text-tekin-gray-900">{name}</span>
                    <span className="text-right">
                      <span className="block text-[16px] font-semibold text-tekin-gray-900">
                        {formatRwf(due)}
                      </span>
                      {due > 0 ? (
                        <TekinBadge status="warning" label="Open" />
                      ) : (
                        <TekinBadge status="healthy" label="Clear" />
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </TekinCard>

        <TekinCard className="flex min-h-[420px] flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Selected waiter
              </p>
              <p className="text-[22px] font-semibold text-tekin-gray-900">{selectedWaiter}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Balance to settle
              </p>
              <p className="text-[28px] font-semibold text-tekin-gray-900">
                {formatRwf(selectedTotal)}
              </p>
            </div>
          </div>

          {unpaidForSelected.length === 0 ? (
            <div className="flex flex-1 flex-col justify-center rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-tekin-gray-900">
                No unpaid orders for this waiter.
              </p>
              <p className="mt-2 text-[13px] text-tekin-gray-600">
                When they confirm new rounds on the handset, open tabs appear here automatically.
              </p>
            </div>
          ) : (
            <>
              <ul className="flex max-h-[340px] flex-col gap-2 overflow-auto">
                {unpaidForSelected.map((o) => (
                  <li
                    key={o.id}
                    className="rounded-xl border border-tekin-gray-200 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold text-tekin-gray-900">{o.id}</span>
                      <span className="text-[18px] font-semibold text-tekin-gray-900">
                        {formatRwf(o.totalRwf)}
                      </span>
                    </div>
                    <p className="text-[13px] text-tekin-gray-600">
                      Table {o.table ?? '—'} · {relativeOrAbsolute(o.receivedAt)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 border-t border-tekin-gray-100 pt-4">
                <TekinButton
                  type="button"
                  className="min-h-[52px] w-full text-[15px]"
                  disabled={selectedTotal <= 0}
                  onClick={() => settleWaiterUnpaid(selectedWaiter)}
                >
                  Record settlement · {formatRwf(selectedTotal)}
                </TekinButton>
                <p className="text-center text-[12px] text-tekin-gray-600">
                  Demo: books every open ticket for this waiter as cash collected and closes hand-in
                  in one step.
                </p>
              </div>
            </>
          )}
        </TekinCard>
      </div>
    </div>
  )
}
