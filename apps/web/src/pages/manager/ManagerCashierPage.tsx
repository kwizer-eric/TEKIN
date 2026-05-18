/**
 * Screen: Manager cashier bridge — drawer & MoMo retries mock.
 */
import { TekinAlert, TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { Link } from 'react-router-dom'
import {
  MANAGER_CASHIER_PULSE,
  MANAGER_MOMO_RETRIES,
} from './managerMocks'
import { formatRwf } from '../../lib/format'

export function ManagerCashierPage() {
  const { shiftLabel, drawerExpectedRwf, drawerDeclaredRwf, momoRetries, splitsOpen } =
    MANAGER_CASHIER_PULSE
  const gap = drawerExpectedRwf - drawerDeclaredRwf

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Link to="/cashier/orders" className="inline-flex">
          <TekinButton type="button">Open cashier live orders</TekinButton>
        </Link>
        <Link to="/cashier/waiter-settle" className="inline-flex">
          <TekinButton type="button" variant="secondary">
            Waiter balance desk
          </TekinButton>
        </Link>
      </div>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <TekinMetricCard
          label="Shift"
          value={shiftLabel}
          delta={{ text: 'Jean-Baptiste on lane', tone: 'neutral' }}
        />
        <TekinMetricCard
          label="Drawer variance"
          value={formatRwf(Math.abs(gap))}
          delta={{
            text: gap >= 0 ? 'Below expected' : 'Above expected',
            tone: Math.abs(gap) > 5000 ? 'warning' : 'positive',
          }}
        />
        <TekinMetricCard
          label="MoMo retries"
          value={momoRetries}
          delta={{ text: 'Needs nudge', tone: momoRetries > 0 ? 'warning' : 'neutral' }}
        />
        <TekinMetricCard
          label="Open splits"
          value={splitsOpen}
          delta={{ text: 'Awaiting guest confirm', tone: 'neutral' }}
        />
      </section>

      <TekinCard>
        <h2 className="text-[16px] font-semibold text-tekin-gray-900">
          Drawer reconciliation (mock)
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-tekin-gray-600">
              Expected
            </p>
            <p className="mt-2 text-[26px] font-semibold tabular-nums text-tekin-gray-900">
              {formatRwf(drawerExpectedRwf)}
            </p>
          </div>
          <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-tekin-gray-600">
              Declared
            </p>
            <p className="mt-2 text-[26px] font-semibold tabular-nums text-tekin-gray-900">
              {formatRwf(drawerDeclaredRwf)}
            </p>
          </div>
        </div>
        {Math.abs(gap) > 3000 ? (
          <div className="mt-4">
            <TekinAlert
              severity="warning"
              title="Variance threshold"
              message="Investigate MoMo lag before signing close — mock threshold tripped at 3,000 RWF."
            />
          </div>
        ) : null}
      </TekinCard>

      <TekinCard>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-[16px] font-semibold text-tekin-gray-900">
            MoMo retry queue
          </h2>
          <TekinBadge status="warning" label={`${MANAGER_MOMO_RETRIES.length} open`} />
        </div>
        <ul className="flex flex-col gap-3">
          {MANAGER_MOMO_RETRIES.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-tekin-gray-200 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-tekin-gray-900">{row.id}</p>
                <p className="text-[13px] text-tekin-gray-600">
                  {row.guestMask} · {row.reason} · {row.ageMin} min
                </p>
              </div>
              <span className="text-[17px] font-semibold tabular-nums">
                {formatRwf(row.amountRwf)}
              </span>
            </li>
          ))}
        </ul>
      </TekinCard>
    </div>
  )
}
