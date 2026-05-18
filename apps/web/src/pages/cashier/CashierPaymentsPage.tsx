/**
 * Screen: Cashier payments — Cashier — Direct-pay custody vs counter flows.
 */
import { TekinBadge, TekinCard, TekinMetricCard } from '@tekin/ui'
import { useMemo } from 'react'
import { formatRwf } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

export function CashierPaymentsPage() {
  const orders = useAppStore((s) => s.cashierOrders)

  const rollups = useMemo(() => {
    const paid = orders.filter((o) => o.paid)
    const directPaid = paid.filter((o) => o.channel !== 'waiter')
    const waiterPaidCounter = paid.filter((o) => o.channel === 'waiter')
    const custodyDirect = directPaid.reduce((s, o) => s + o.totalRwf, 0)
    const custodyCounterWaiter = waiterPaidCounter.reduce(
      (s, o) => s + o.totalRwf,
      0,
    )
    const byChannel = new Map<string, number>()
    directPaid.forEach((o) => {
      const key =
        o.channel === 'table_qr'
          ? 'Table QR'
          : o.channel === 'online'
            ? 'Online'
            : 'Nearby'
      byChannel.set(key, (byChannel.get(key) ?? 0) + o.totalRwf)
    })
    return {
      custodyDirect,
      custodyCounterWaiter,
      byChannel: [...byChannel.entries()],
      directCount: directPaid.length,
      waiterPaidCount: waiterPaidCounter.length,
    }
  }, [orders])

  return (
    <div className="flex flex-col gap-4">
      <TekinCard className="border-tekin-blue bg-tekin-blue-light">
        <p className="text-[13px] font-semibold text-tekin-blue">
          Reporting snapshot
        </p>
        <p className="mt-2 text-sm text-tekin-gray-800">
          <span className="font-semibold text-tekin-gray-800">Direct-pay</span>{' '}
          channels settle straight into venue custody (shown below).{' '}
          <span className="font-semibold text-tekin-gray-800">Floor waiter</span>{' '}
          floor tabs paid at your counter add to drawer totals once you confirm hand-in on{' '}
          <span className="font-semibold text-tekin-gray-800">Live orders</span>.
        </p>
      </TekinCard>

      <div className="grid gap-4 md:grid-cols-2">
        <TekinMetricCard
          label="Venue custody · direct pay"
          value={formatRwf(rollups.custodyDirect)}
          delta={{
            text: `${rollups.directCount} settled ticket${rollups.directCount === 1 ? '' : 's'}`,
            tone: 'neutral',
          }}
        />
        <TekinMetricCard
          label="Collected at counter (floor tabs)"
          value={formatRwf(rollups.custodyCounterWaiter)}
          delta={{
            text: `${rollups.waiterPaidCount} waiter-origin`,
            tone: 'neutral',
          }}
        />
      </div>

      <TekinCard>
        <h2 className="mb-4 text-[16px] font-semibold text-tekin-gray-900">
          Direct channels breakdown
        </h2>
        {rollups.byChannel.length === 0 ? (
          <p className="text-sm text-tekin-gray-600">
            No direct-pay tickets in this demo slice yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rollups.byChannel.map(([label, rwf]) => (
              <li
                key={label}
                className="flex items-center justify-between rounded-xl border border-tekin-gray-200 px-4 py-3"
              >
                <TekinBadge status="neutral" label={label} />
                <span className="text-[18px] font-semibold text-tekin-gray-900">
                  {formatRwf(rwf)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </TekinCard>
    </div>
  )
}
