/**
 * Screen: Manager staff — roster & overtime risk mock.
 */
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { MANAGER_STAFF_ROWS } from './managerMocks'

function otTone(r: (typeof MANAGER_STAFF_ROWS)[0]['overtimeRisk']) {
  if (r === 'high') return { status: 'critical' as const, label: 'High OT risk' }
  if (r === 'medium') return { status: 'warning' as const, label: 'Medium' }
  return { status: 'healthy' as const, label: 'Stable' }
}

export function ManagerStaffPage() {
  const high = MANAGER_STAFF_ROWS.filter((s) => s.overtimeRisk === 'high').length

  return (
    <div className="flex flex-col gap-4">
      <TekinMetricCard
        label="Overtime watchlist"
        value={high}
        delta={{
          text: 'Staff above pacing threshold (demo)',
          tone: high > 0 ? 'warning' : 'positive',
        }}
        unit="people"
      />

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Tonight roster
            </h2>
            <p className="mt-1 text-[13px] text-tekin-gray-600">
              HR integrations would sync punches — this grid is illustrative.
            </p>
          </div>
          <TekinButton type="button" variant="secondary">
            Publish schedule
          </TekinButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {MANAGER_STAFF_ROWS.map((person) => {
            const ot = otTone(person.overtimeRisk)
            return (
              <div
                key={person.name}
                className="rounded-2xl border border-tekin-gray-200 bg-tekin-gray-50/60 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[15px] font-semibold text-tekin-gray-900">{person.name}</p>
                    <p className="mt-1 text-[13px] font-medium text-tekin-emerald">{person.role}</p>
                  </div>
                  <TekinBadge status={ot.status} label={ot.label} />
                </div>
                <p className="mt-3 text-[13px] text-tekin-gray-700">
                  <span className="font-semibold text-tekin-gray-800">Shift · </span>
                  {person.shift}
                </p>
                {person.cert ? (
                  <p className="mt-2 text-[12px] text-tekin-gray-600">{person.cert}</p>
                ) : null}
              </div>
            )
          })}
        </div>
      </TekinCard>
    </div>
  )
}
