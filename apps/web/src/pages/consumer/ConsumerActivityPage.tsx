/**
 * Screen: Consumer activity — Consumer — Recent trust signals as cards.
 */
import { TekinBadge, TekinCard } from '@tekin/ui'
import { TRUST_ACTIVITY } from '../../data/fixtures'
import { relativeOrAbsolute } from '../../lib/format'

const badgeForTone = {
  healthy: 'healthy' as const,
  info: 'info' as const,
  warning: 'warning' as const,
}

export function ConsumerActivityPage() {
  return (
    <div className="flex flex-col gap-4">
      <TekinCard className="border border-tekin-blue bg-tekin-blue-light">
        <p className="text-sm font-semibold text-tekin-blue">
          Rhythm beats spreadsheets.
        </p>
        <p className="mt-2 text-sm text-tekin-gray-700">
          Every touch below is a decision-ready signal — not raw ledger noise.
        </p>
      </TekinCard>

      <div className="grid gap-3 md:grid-cols-2">
        {TRUST_ACTIVITY.map((item) => (
          <TekinCard key={item.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] font-semibold text-tekin-gray-900">{item.title}</p>
              <TekinBadge status={badgeForTone[item.tone]} label="Record" />
            </div>
            <p className="mt-3 text-sm text-tekin-gray-600">{item.detail}</p>
            <p className="mt-4 text-[12px] font-medium uppercase tracking-wide text-tekin-gray-600">
              {relativeOrAbsolute(item.ts)}
            </p>
          </TekinCard>
        ))}
      </div>
    </div>
  )
}
