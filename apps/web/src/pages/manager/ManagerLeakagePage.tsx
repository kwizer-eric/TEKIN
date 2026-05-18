/**
 * Screen: Manager leakage — risk score & incidents mock.
 */
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { MANAGER_LEAKAGE_INCIDENTS } from './managerMocks'
import { formatRwf } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

function riskBadge(risk: (typeof MANAGER_LEAKAGE_INCIDENTS)[0]['risk']) {
  if (risk === 'high') return { status: 'critical' as const, label: 'High' }
  if (risk === 'medium') return { status: 'warning' as const, label: 'Medium' }
  return { status: 'neutral' as const, label: 'Low' }
}

export function ManagerLeakagePage() {
  const score = useAppStore((s) => s.leakageRisk)
  const exposure = MANAGER_LEAKAGE_INCIDENTS.reduce((s, i) => s + i.amountRwf, 0)

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <TekinMetricCard
          label="Leakage risk score"
          value={score}
          unit="/ 100"
          delta={{
            text: 'Blends voids · comps · splits',
            tone: score > 60 ? 'warning' : 'positive',
          }}
        />
        <TekinMetricCard
          label="Flagged exposure (shift)"
          value={formatRwf(exposure)}
          delta={{ text: 'Demo incidents below', tone: 'neutral' }}
        />
      </section>

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Incident stream
            </h2>
            <p className="mt-1 text-[13px] text-tekin-gray-600">
              Coaching-ready rows — connect POS exceptions when backend lands.
            </p>
          </div>
          <TekinButton type="button" variant="secondary">
            Assign review
          </TekinButton>
        </div>
        <ul className="flex flex-col gap-3">
          {MANAGER_LEAKAGE_INCIDENTS.map((row) => {
            const rb = riskBadge(row.risk)
            return (
              <li
                key={row.id}
                className="rounded-xl border border-tekin-gray-200 px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-tekin-gray-900">{row.id}</span>
                      <TekinBadge status="neutral" label={row.type} />
                      <TekinBadge status={rb.status} label={rb.label} />
                    </div>
                    <p className="mt-2 text-[13px] text-tekin-gray-600">
                      {row.actor} · Table {row.table}
                    </p>
                  </div>
                  <span className="text-[18px] font-semibold tabular-nums text-tekin-gray-900">
                    {formatRwf(row.amountRwf)}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </TekinCard>
    </div>
  )
}
