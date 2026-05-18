/**
 * Screen: Cashier shift — Cashier — Close with confidence.
 */
import { TekinAlert, TekinButton, TekinCard, TekinInput } from '@tekin/ui'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { STAFF } from '../../data/fixtures'
import { formatRwf } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

export function CashierShiftPage() {
  const shift = useAppStore((s) => s.shift)
  const updateDeclared = useAppStore((s) => s.updateDeclaredCash)
  const orders = useAppStore((s) => s.cashierOrders)
  const salesConfirmedTodayByWaiter = useAppStore(
    (s) => s.salesConfirmedTodayByWaiter,
  )
  const settleAllWaiterUnpaidAtEod = useAppStore(
    (s) => s.settleAllWaiterUnpaidAtEod,
  )

  const mismatch = shift.expectedCashRwf - shift.declaredCashRwf

  const waiterUnsettled = useMemo(() => {
    const unpaid = orders.filter((o) => o.channel === 'waiter' && !o.paid)
    const total = unpaid.reduce((s, o) => s + o.totalRwf, 0)
    const byWaiter = new Map<string, number>()
    unpaid.forEach((o) => {
      const w = o.placedByWaiterName ?? 'Unknown'
      byWaiter.set(w, (byWaiter.get(w) ?? 0) + o.totalRwf)
    })
    return {
      total,
      unpaidCount: unpaid.length,
      byWaiter: [...byWaiter.entries()].sort((a, b) => b[1] - a[1]),
    }
  }, [orders])

  return (
    <div className="flex flex-col gap-4">
      <TekinCard className="border-tekin-navy bg-tekin-white">
        <h2 className="text-[16px] font-semibold text-tekin-gray-900">
          End of day · waiter balance
        </h2>
        <p className="mt-2 text-sm text-tekin-gray-600">
          Tabs opened on the floor stay in{' '}
          <span className="font-semibold text-tekin-gray-800">waiter hold</span>{' '}
          until guests pay at the desk or you record cash collected from each waiter here.
        </p>
        <p className="mt-3 text-[13px] text-tekin-gray-700">
          During service, reconcile named balances on{' '}
          <Link
            to="/cashier/waiter-settle"
            className="font-semibold text-tekin-emerald underline-offset-2 hover:underline"
          >
            Waiter balance
          </Link>{' '}
          — each waiter&apos;s open tabs and totals in one view.
        </p>

        {waiterUnsettled.unpaidCount === 0 ? (
          <div className="mt-4 rounded-xl border border-tekin-emerald bg-tekin-emerald-light px-4 py-4">
            <p className="text-sm font-semibold text-tekin-emerald">
              No unpaid floor tickets — waiters are square for this snapshot.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 rounded-xl border border-tekin-amber bg-tekin-amber-light px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Still with waiters (guest not paid at desk)
              </p>
              <p className="mt-2 text-[28px] font-semibold text-tekin-gray-900">
                {formatRwf(waiterUnsettled.total)}
              </p>
              <p className="mt-1 text-[13px] text-tekin-gray-700">
                {waiterUnsettled.unpaidCount} order
                {waiterUnsettled.unpaidCount === 1 ? '' : 's'}
              </p>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {waiterUnsettled.byWaiter.map(([name, rwf]) => (
                <li
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-tekin-gray-200 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-tekin-gray-900">{name}</span>
                  <span className="font-semibold text-tekin-gray-900">
                    {formatRwf(rwf)}
                  </span>
                </li>
              ))}
            </ul>
            <TekinButton
              type="button"
              className="mt-4 min-h-[52px] w-full"
              onClick={() => settleAllWaiterUnpaidAtEod()}
            >
              Record waiter settlement (mark unpaid floor paid)
            </TekinButton>
            <p className="mt-2 text-[12px] text-tekin-gray-600">
              Demo shortcut: records venue collected outstanding tabs from waiters as cash — production flow would attach counts per waiter.
            </p>
          </>
        )}
      </TekinCard>

      <TekinCard>
        <h2 className="text-[16px] font-semibold text-tekin-gray-900">
          Floor revenue booked tonight
        </h2>
        <p className="mt-2 text-sm text-tekin-gray-600">
          Confirmed handset totals increment when waiters tap{' '}
          <span className="font-semibold text-tekin-gray-800">Confirm order</span> — cross-check
          against unpaid tabs above before closing.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {STAFF.waiters.map((name) => (
            <li
              key={name}
              className="flex items-center justify-between rounded-lg border border-tekin-gray-200 px-3 py-2 text-sm"
            >
              <span className="font-medium text-tekin-gray-900">{name}</span>
              <span className="font-semibold text-tekin-gray-900">
                {formatRwf(salesConfirmedTodayByWaiter[name] ?? 0)}
              </span>
            </li>
          ))}
        </ul>
      </TekinCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <TekinCard>
          <h2 className="text-[16px] font-semibold text-tekin-gray-900">
            Shift pulse
          </h2>
          <p className="mt-2 text-sm text-tekin-gray-600">
            Opened {shift.openedAt} · covers walk-ins + reservations tonight.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Expected cash
              </p>
              <p className="mt-2 text-[28px] font-semibold text-tekin-gray-900">
                {formatRwf(shift.expectedCashRwf)}
              </p>
            </div>
            <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Declared cash
              </p>
              <p className="mt-2 text-[28px] font-semibold text-tekin-gray-900">
                {formatRwf(shift.declaredCashRwf)}
              </p>
            </div>
          </div>
          <TekinInput
            label="Adjust declared cash"
            type="number"
            value={String(shift.declaredCashRwf)}
            className="mt-6"
            onChange={(e) => updateDeclared(Number(e.target.value || 0))}
          />
        </TekinCard>

        <div className="flex flex-col gap-4">
          {Math.abs(mismatch) > 2000 ? (
            <TekinAlert
              severity="critical"
              title="Cash mismatch — review"
              message={`${formatRwf(Math.abs(mismatch))} gap versus expected drawer — reconcile MoMo takings before closing.`}
            />
          ) : (
            <TekinAlert
              severity="success"
              title="Drawer aligned"
              message="Minor variance within tolerance — safe to prep close."
            />
          )}
          <TekinCard>
            <TekinButton type="button" variant="secondary" className="mb-3 w-full min-h-[52px]">
              Pause orders
            </TekinButton>
            <TekinButton type="button" className="w-full min-h-[52px]">
              Close shift
            </TekinButton>
          </TekinCard>
        </div>
      </div>
    </div>
  )
}
