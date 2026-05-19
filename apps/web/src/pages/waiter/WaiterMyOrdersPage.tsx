/**
 * Screen: Waiter my orders — Waiter — Live link to cashier & kitchen.
 */
import { TekinBadge, TekinCard, TekinEmptyState } from '@tekin/ui'
import { ClipboardList } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CashierOrderRow } from '../../data/fixtures'
import { formatRwf, relativeOrAbsolute } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

function paymentBadge(order: CashierOrderRow) {
  if (!order.paid) {
    return <TekinBadge status="warning" label="Open tab" />
  }
  if (
    order.channel === 'waiter' &&
    order.paid &&
    !order.waiterHandoverComplete
  ) {
    return <TekinBadge status="warning" label="Desk paid · hand-in" />
  }
  return (
    <TekinBadge
      status="healthy"
      label={order.method ? `Paid · ${order.method}` : 'Paid'}
    />
  )
}

export function WaiterMyOrdersPage() {
  const session = useAppStore((s) => s.waiterSession)
  const orders = useAppStore((s) => s.cashierOrders)
  const salesConfirmedTodayByWaiter = useAppStore(
    (s) => s.salesConfirmedTodayByWaiter,
  )

  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day')

  const sinceTs = useMemo(() => {
    const now = new Date()
    if (period === 'day') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return start.getTime()
    }
    if (period === 'week') {
      const day = now.getDay()
      const diffToMonday = (day + 6) % 7
      const start = new Date(now)
      start.setDate(now.getDate() - diffToMonday)
      start.setHours(0, 0, 0, 0)
      return start.getTime()
    }
    if (period === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return start.getTime()
    }
    return new Date(now.getFullYear(), 0, 1).getTime()
  }, [period])

  const mine = useMemo(() => {
    if (!session) return []
    return orders
      .filter(
        (o) =>
          o.channel === 'waiter' &&
          o.placedByWaiterName === session.name &&
          o.receivedAt >= sinceTs,
      )
      .slice()
      .sort((a, b) => b.receivedAt - a.receivedAt)
  }, [orders, session, sinceTs])

  const shiftTotal =
    session != null ? salesConfirmedTodayByWaiter[session.name] ?? 0 : 0

  if (!session) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <TekinCard className="border-tekin-navy bg-tekin-white">
        <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
          Confirmed sales · your handset (shift tally)
        </p>
        <p className="mt-2 text-[32px] font-semibold text-tekin-gray-900">
          {formatRwf(shiftTotal)}
        </p>
        <p className="mt-2 text-[13px] text-tekin-gray-600">
          Every confirmed round increments here — cashier ties it to settlement at close.
        </p>
      </TekinCard>

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[16px] font-semibold text-tekin-gray-900">
            Your floor tickets
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {(['day', 'week', 'month', 'year'] as const).map((window) => (
              <button
                key={window}
                type="button"
                onClick={() => setPeriod(window)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                  period === window
                    ? 'bg-tekin-emerald text-white'
                    : 'bg-tekin-gray-100 text-tekin-gray-700 hover:bg-tekin-gray-200'
                }`}
              >
                {window}
              </button>
            ))}
            <TekinBadge status="info" label={`${mine.length} linked`} />
          </div>
        </div>
        {mine.length === 0 ? (
          <TekinEmptyState
            icon={ClipboardList}
            title="Nothing sent yet"
            description="Confirm an order from New order — it lands on the cashier and kitchen instantly."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {mine.map((row) => (
              <li
                key={row.id}
                className="rounded-xl border border-tekin-gray-200 px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold text-tekin-gray-900">
                      {row.id}
                    </p>
                    <p className="text-[13px] text-tekin-gray-600">
                      {row.table ? `Table ${row.table}` : 'No table'}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-tekin-gray-400">
                      Sent {relativeOrAbsolute(row.receivedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[20px] font-semibold text-tekin-gray-900">
                      {formatRwf(row.totalRwf)}
                    </span>
                    {paymentBadge(row)}
                  </div>
                </div>
                {row.lines != null && row.lines.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-1 border-t border-tekin-gray-100 pt-3 text-[13px] text-tekin-gray-700">
                    {row.lines.map((line, idx) => (
                      <li key={`${line.name}-${idx}`}>
                        {line.qty}× {line.name}
                        <span className="ml-2 text-tekin-gray-500">
                          ({line.kind})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {row.barQueuePriority ? (
                  <p className="mt-2 text-[12px] font-semibold text-tekin-emerald">
                    Bar-first ticket · pours ahead of food-only tabs.
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </TekinCard>
    </div>
  )
}
