/**
 * Screen: Manager kitchen pulse — stations & SLA mock view.
 */
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { Link } from 'react-router-dom'
import { MANAGER_KITCHEN_STATIONS } from './managerMocks'

export function ManagerKitchenPage() {
  const breaches = MANAGER_KITCHEN_STATIONS.reduce(
    (s, x) => s + x.slaBreaches,
    0,
  )
  const tickets = MANAGER_KITCHEN_STATIONS.reduce((s, x) => s + x.tickets, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TekinMetricCard
          label="Tickets in venue rails"
          value={tickets}
          delta={{ text: 'Hot · cold · bar', tone: 'neutral' }}
          unit="open"
        />
        <TekinMetricCard
          label="SLA breaches (hour)"
          value={breaches}
          delta={{
            text: breaches > 0 ? 'Review cold line prep' : 'On cadence',
            tone: breaches > 0 ? 'warning' : 'positive',
          }}
        />
      </div>

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Station pulse
            </h2>
            <p className="mt-1 text-[13px] text-tekin-gray-600">
              Mock telemetry — pair with the live KDS for execution.
            </p>
          </div>
          <Link to="/kitchen">
            <TekinButton type="button">Open kitchen board</TekinButton>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {MANAGER_KITCHEN_STATIONS.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-tekin-gray-200 bg-tekin-gray-50/80 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-semibold text-tekin-gray-900">{s.label}</p>
                <TekinBadge
                  status={
                    s.tone === 'critical'
                      ? 'critical'
                      : s.tone === 'warning'
                        ? 'warning'
                        : 'healthy'
                  }
                  label={s.tone === 'healthy' ? 'Stable' : 'Watch'}
                />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <dt className="font-medium uppercase tracking-wide text-tekin-gray-500">
                    Queue
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-tekin-gray-900">
                    {s.tickets}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium uppercase tracking-wide text-tekin-gray-500">
                    Median
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-tekin-gray-900">
                    {s.medianMin} min
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium uppercase tracking-wide text-tekin-gray-500">
                    SLA breaches
                  </dt>
                  <dd className="mt-1 font-semibold text-tekin-gray-800">{s.slaBreaches}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </TekinCard>
    </div>
  )
}
