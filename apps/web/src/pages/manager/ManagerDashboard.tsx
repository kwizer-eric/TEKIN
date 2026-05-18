/**
 * Screen: Manager dashboard — Manager — Strategic pulse for Inzovu Lounge.
 */
import {
  TekinBadge,
  TekinCard,
  TekinLiveIndicator,
  TekinMetricCard,
} from '@tekin/ui'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Brain, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AI_INSIGHTS,
  INITIAL_LIVE_FEED,
  KITCHEN_PERF,
  TOP_SELLERS,
  type LiveOrderFeedItem,
} from '../../data/fixtures'
import { formatRwf, relativeOrAbsolute } from '../../lib/format'
import { liveOn } from '../../lib/liveBus'
import { useCountUp } from '../../hooks/useCountUp'
import { useAppStore } from '../../stores/useAppStore'

const insightIcon = {
  healthy: TrendingUp,
  warning: AlertTriangle,
  critical: AlertTriangle,
  info: Brain,
} as const

export function ManagerDashboard() {
  const revenueTodayRwf = useAppStore((s) => s.revenueTodayRwf)
  const activeOrders = useAppStore((s) => s.activeOrders)
  const leakageRisk = useAppStore((s) => s.leakageRisk)
  const stockAlerts = useAppStore((s) => s.stockAlerts)

  const revenueAnimated = useCountUp(revenueTodayRwf, 520)
  const ordersAnimated = useCountUp(activeOrders, 480)

  const sellersQuery = useQuery({
    queryKey: ['top-sellers'],
    queryFn: async () => TOP_SELLERS,
    staleTime: 60_000,
  })

  const perfQuery = useQuery({
    queryKey: ['kitchen-perf'],
    queryFn: async () => KITCHEN_PERF,
    staleTime: 60_000,
  })

  const [feed, setFeed] = useState<LiveOrderFeedItem[]>(INITIAL_LIVE_FEED)

  useEffect(() => {
    const unsub = liveOn('order:live', (p) => {
      const nextTotal =
        MENU_LOOKUP[
          Math.floor(Math.random() * MENU_LOOKUP.length)
        ] ?? 12_000
      const item: LiveOrderFeedItem = {
        id: `live-${Date.now()}`,
        label: `New order · Table ${p.table}`,
        amountRwf: nextTotal,
        table: p.table,
        status: 'info',
        ts: Date.now(),
      }
      setFeed((prev) => [item, ...prev].slice(0, 8))
    })
    return unsub
  }, [])

  const leakageTone = useMemo(() => {
    if (leakageRisk < 40) return 'positive' as const
    if (leakageRisk < 70) return 'warning' as const
    return 'negative' as const
  }, [leakageRisk])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TekinLiveIndicator label="Live venue" />
        <p className="text-[13px] text-tekin-gray-600">
          Shift rhythm · <span className="font-medium text-tekin-gray-800">18:00 – 02:00</span>
        </p>
      </div>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <TekinMetricCard
          label="Today's revenue"
          value={formatRwf(revenueAnimated)}
          delta={{ text: '+8.4% vs yesterday', tone: 'positive' }}
        />
        <TekinMetricCard
          label="Active orders"
          value={ordersAnimated}
          delta={{ text: 'Kitchen keeping pace', tone: 'neutral' }}
          unit="open"
        />
        <TekinMetricCard
          label="Leakage risk score"
          value={leakageRisk}
          unit="/ 100"
          delta={{
            text: '−6 pts vs last night',
            tone: leakageTone === 'positive' ? 'positive' : 'warning',
          }}
        />
        <TekinMetricCard
          label="Stock alerts"
          value={stockAlerts}
          delta={{
            text: 'Review tilapia cover',
            tone: stockAlerts > 2 ? 'warning' : 'neutral',
          }}
          unit="SKUs"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <TekinCard className="min-h-[320px]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Live order feed
            </h2>
            <TekinBadge status="healthy" label="Streaming" />
          </div>
          <ul className="flex flex-col gap-3">
            {feed.map((item, idx) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-3 transition-opacity duration-150 ease-out"
                style={{
                  animation: `tekin-slide-in 200ms ease-out ${idx * 40}ms both`,
                }}
              >
                <div>
                  <p className="text-sm font-medium text-tekin-gray-900">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[12px] font-medium uppercase tracking-wide text-tekin-gray-600">
                    Table {item.table} · {relativeOrAbsolute(item.ts)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-semibold text-tekin-gray-900">
                    {formatRwf(item.amountRwf)}
                  </span>
                  <TekinBadge
                    status={
                      item.status === 'warning'
                        ? 'warning'
                        : item.status === 'healthy'
                          ? 'healthy'
                          : 'info'
                    }
                    label={item.status === 'healthy' ? 'Paid path' : 'In motion'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </TekinCard>

        <TekinCard className="min-h-[320px]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              AI insights
            </h2>
            <Brain className="h-5 w-5 text-tekin-blue" aria-hidden />
          </div>
          <ul className="flex flex-col gap-3">
            {AI_INSIGHTS.map((insight) => {
              const Icon = insightIcon[insight.severity]
              const badgeStatus =
                insight.severity === 'critical'
                  ? 'critical'
                  : insight.severity === 'warning'
                    ? 'warning'
                    : insight.severity === 'healthy'
                      ? 'healthy'
                      : 'info'
              return (
                <li
                  key={insight.id}
                  className="rounded-lg border border-tekin-gray-200 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 text-tekin-gray-600" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-tekin-gray-900">
                        {insight.title}
                      </p>
                      <p className="mt-1 text-sm text-tekin-gray-600">
                        {insight.detail}
                      </p>
                      <div className="mt-3">
                        <TekinBadge
                          status={badgeStatus}
                          label={
                            insight.severity === 'critical'
                              ? 'Act now'
                              : insight.severity === 'warning'
                                ? 'Watch'
                                : 'Signal'
                          }
                        />
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </TekinCard>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TekinCard>
          <h2 className="mb-4 text-[16px] font-semibold text-tekin-gray-900">
            Top selling tonight
          </h2>
          <div className="flex flex-col gap-3">
            {(sellersQuery.data ?? TOP_SELLERS).map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-lg border border-tekin-gray-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-tekin-gray-900">{row.name}</p>
                  <p className="text-[12px] uppercase tracking-wide text-tekin-gray-600">
                    {row.orders} orders
                  </p>
                </div>
                <p className="text-[18px] font-semibold text-tekin-gray-900">
                  {formatRwf(row.revenueRwf)}
                </p>
              </div>
            ))}
          </div>
        </TekinCard>

        <TekinCard>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Kitchen performance
            </h2>
            <span className="text-[12px] font-medium uppercase tracking-wide text-tekin-gray-600">
              Median minutes
            </span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfQuery.data ?? KITCHEN_PERF}>
                <CartesianGrid stroke="var(--tekin-gray-200)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--tekin-gray-600)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--tekin-gray-600)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--tekin-gray-50)' }}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: 'var(--tekin-gray-200)',
                    fontSize: 13,
                  }}
                />
                <Bar
                  dataKey="minutes"
                  radius={[6, 6, 0, 0]}
                  fill="var(--tekin-emerald-mid)"
                  stroke="var(--tekin-emerald)"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TekinCard>
      </section>
    </div>
  )
}

const MENU_LOOKUP = [9200, 14_300, 22_100, 18_750, 6400]
