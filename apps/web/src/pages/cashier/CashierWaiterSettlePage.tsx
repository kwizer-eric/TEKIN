/**
 * Screen: Waiter balance — floor tickets, pipeline, and bulk settlement.
 */
import { TekinBadge, TekinButton, TekinCard } from '@tekin/ui'
import { useMemo, useState } from 'react'
import type { CashierOrderRow } from '../../data/fixtures'
import { STAFF } from '../../data/fixtures'
import { formatRwf } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'
import { CashierOrdersFeed } from './CashierOrdersFeed'

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

  const unpaidForSelected = rowsByWaiter.get(selectedWaiter) ?? []
  const selectedTotal = totalsByWaiter[selectedWaiter] ?? 0
  const openTabCount = unpaidForSelected.length

  return (
    <div className="flex flex-col gap-6 pb-6">
      <CashierOrdersFeed
        variant="waiterBalance"
        focusWaiterName={selectedWaiter}
      />

      <div className="border-t border-tekin-gray-200 pt-4">
        <h2 className="text-[16px] font-semibold text-tekin-gray-900">
          Bulk settlement
        </h2>
        <p className="mt-1 text-[13px] text-tekin-gray-600">
          Pick a waiter — open tabs are in the list above. Record one payment for
          their full balance.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          <TekinCard className="flex flex-col">
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-tekin-gray-600">
              Waiters
            </h3>
            <ul className="mt-3 flex max-h-[min(40vh,360px)] flex-col gap-2 overflow-y-auto pr-1">
              {STAFF.waiters.map((name) => {
                const due = totalsByWaiter[name] ?? 0
                const tabCount = (rowsByWaiter.get(name) ?? []).length
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
                      <span className="text-sm font-semibold text-tekin-gray-900">
                        {name}
                      </span>
                      <span className="text-right">
                        <span className="block text-[16px] font-semibold text-tekin-gray-900">
                          {formatRwf(due)}
                        </span>
                        {due > 0 ? (
                          <TekinBadge
                            status="warning"
                            label={`${tabCount} open`}
                          />
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

          <TekinCard className="flex flex-col justify-center gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                  Selected
                </p>
                <p className="text-[22px] font-semibold text-tekin-gray-900">
                  {selectedWaiter}
                </p>
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

            {openTabCount === 0 ? (
              <p className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-8 text-center text-sm text-tekin-gray-600">
                No unpaid tabs for {selectedWaiter}. List above shows hand-ins and
                past floor tickets.
              </p>
            ) : (
              <>
                <p className="text-[13px] text-tekin-gray-600">
                  {openTabCount} open tab{openTabCount === 1 ? '' : 's'} for{' '}
                  {selectedWaiter} in the list above — totals{' '}
                  {formatRwf(selectedTotal)}.
                </p>
                <TekinButton
                  type="button"
                  className="min-h-[52px] w-full text-[15px]"
                  onClick={() => settleWaiterUnpaid(selectedWaiter)}
                >
                  Record settlement · {formatRwf(selectedTotal)}
                </TekinButton>
              </>
            )}
          </TekinCard>
        </div>
      </div>
    </div>
  )
}
