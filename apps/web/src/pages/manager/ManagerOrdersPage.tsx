/**
 * Screen: Manager orders — venue-wide pipeline with mock rows.
 */
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { useMemo, useState } from 'react'
import { MANAGER_ORDERS } from './managerMocks'
import { formatRwf } from '../../lib/format'

type ManagerOrderRow = (typeof MANAGER_ORDERS)[number]
type Filter = 'all' | ManagerOrderRow['channel']

function phaseBadge(phase: ManagerOrderRow['phase']) {
  if (phase === 'Closed') return { status: 'healthy' as const, label: phase }
  if (phase === 'Kitchen' || phase === 'Bar') return { status: 'info' as const, label: phase }
  if (phase === 'Settling') return { status: 'warning' as const, label: phase }
  return { status: 'neutral' as const, label: phase }
}

export function ManagerOrdersPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const rows = useMemo(() => {
    if (filter === 'all') return MANAGER_ORDERS
    return MANAGER_ORDERS.filter((r) => r.channel === filter)
  }, [filter])

  const openValue = useMemo(
    () =>
      MANAGER_ORDERS.filter((r) => r.phase !== 'Closed').reduce(
        (s, r) => s + r.totalRwf,
        0,
      ),
    [],
  )

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <TekinMetricCard
          label="Open pipeline value"
          value={formatRwf(openValue)}
          delta={{ text: 'Across channels tonight', tone: 'neutral' }}
        />
        <TekinMetricCard
          label="Active tickets"
          value={MANAGER_ORDERS.filter((r) => r.phase !== 'Closed').length}
          delta={{ text: 'Mock snapshot', tone: 'neutral' }}
          unit="live"
        />
      </section>

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Order pipeline
            </h2>
            <p className="mt-1 text-[13px] text-tekin-gray-600">
              Manager lens — table, channel, and fulfillment phase (demo data).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'Floor', 'QR', 'Online', 'Nearby'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors duration-150 ${
                  filter === id
                    ? 'bg-tekin-navy text-white'
                    : 'bg-tekin-gray-100 text-tekin-gray-700 hover:bg-tekin-gray-200'
                }`}
              >
                {id === 'all' ? 'All' : id}
              </button>
            ))}
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {rows.map((row) => {
            const pb = phaseBadge(row.phase)
            return (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-tekin-gray-200 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-semibold text-tekin-gray-900">
                      {row.id}
                    </span>
                    <TekinBadge status="neutral" label={row.channel} />
                    <TekinBadge status={pb.status} label={pb.label} />
                  </div>
                  <p className="mt-1 text-[13px] text-tekin-gray-600">
                    Table {row.table}
                    {row.waiter ? ` · ${row.waiter}` : ''} · {row.minutesAgo} min ago
                  </p>
                </div>
                <span className="text-[18px] font-semibold tabular-nums text-tekin-gray-900">
                  {formatRwf(row.totalRwf)}
                </span>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3 border-t border-tekin-gray-100 pt-4">
          <TekinButton type="button" variant="secondary">
            Export CSV
          </TekinButton>
          <TekinButton type="button">Drill into ticket</TekinButton>
        </div>
      </TekinCard>
    </div>
  )
}
