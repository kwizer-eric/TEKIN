/**
 * Screen: Manager analytics — weekly trend mock chart + SKU breakdown.
 */
import { TekinCard, TekinMetricCard } from '@tekin/ui'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TOP_SELLERS } from '../../data/fixtures'
import { MANAGER_ANALYTICS_WEEK } from './managerMocks'
import { formatRwf } from '../../lib/format'

export function ManagerAnalyticsPage() {
  const peak = MANAGER_ANALYTICS_WEEK.reduce(
    (best, p) => (p.revenueRwf > best.revenueRwf ? p : best),
    MANAGER_ANALYTICS_WEEK[0]!,
  )

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <TekinMetricCard
          label="Peak night (mock week)"
          value={peak.label}
          delta={{
            text: `${formatRwf(peak.revenueRwf)} · ${peak.covers} covers`,
            tone: 'positive',
          }}
        />
        <TekinMetricCard
          label="Avg covers / night"
          value={Math.round(
            MANAGER_ANALYTICS_WEEK.reduce((s, p) => s + p.covers, 0) /
              MANAGER_ANALYTICS_WEEK.length,
          )}
          delta={{ text: 'Seven-day mock slice', tone: 'neutral' }}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <TekinCard className="min-h-[340px]">
          <h2 className="mb-2 text-[16px] font-semibold text-tekin-gray-900">
            Revenue trend
          </h2>
          <p className="mb-4 text-[13px] text-tekin-gray-600">
            Mock nightly totals — swap for warehouse facts later.
          </p>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MANAGER_ANALYTICS_WEEK}>
                <CartesianGrid stroke="var(--tekin-gray-200)" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--tekin-gray-600)' }} />
                <YAxis
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 12, fill: 'var(--tekin-gray-600)' }}
                />
                <Tooltip
                  formatter={(value: number) => [formatRwf(value), 'Revenue']}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: 'var(--tekin-gray-200)',
                    fontSize: 13,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenueRwf"
                  stroke="var(--tekin-emerald)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--tekin-emerald)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TekinCard>

        <TekinCard>
          <h2 className="mb-4 text-[16px] font-semibold text-tekin-gray-900">
            SKU contribution
          </h2>
          <ul className="flex flex-col gap-3">
            {TOP_SELLERS.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between rounded-xl border border-tekin-gray-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-tekin-gray-900">{row.name}</p>
                  <p className="text-[12px] uppercase tracking-wide text-tekin-gray-500">
                    {row.orders} orders
                  </p>
                </div>
                <span className="text-[16px] font-semibold tabular-nums text-tekin-gray-900">
                  {formatRwf(row.revenueRwf)}
                </span>
              </li>
            ))}
          </ul>
        </TekinCard>
      </section>
    </div>
  )
}
