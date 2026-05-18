/**
 * Screen: Consumer credit — Consumer — Limits that stay human-readable.
 */
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { CONSUMER_PROFILE } from '../../data/fixtures'
import { formatRwf } from '../../lib/format'

export function ConsumerCreditPage() {
  const remaining =
    CONSUMER_PROFILE.creditLimitRwf - CONSUMER_PROFILE.balanceUsedRwf

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TekinMetricCard
        label="Available tonight"
        value={formatRwf(remaining)}
        delta={{ text: 'Limit adjusts with repayment streak', tone: 'positive' }}
      />
      <TekinMetricCard
        label="In use"
        value={formatRwf(CONSUMER_PROFILE.balanceUsedRwf)}
        delta={{ text: 'On pace vs peers', tone: 'neutral' }}
      />

      <TekinCard className="lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[16px] font-semibold text-tekin-gray-900">
              Extend calmly — TEKIN backs both sides.
            </p>
            <p className="mt-2 max-w-3xl text-sm text-tekin-gray-600">
              Ask Inzovu Lounge for TEKIN checkout · consent stays explicit · limits shrink automatically when rhythm slips.
            </p>
          </div>
          <TekinBadge status="healthy" label="Tap-safe limits" />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <TekinButton type="button">Talk to lounge manager</TekinButton>
          <TekinButton type="button" variant="secondary">
            Share QR receipt
          </TekinButton>
        </div>
      </TekinCard>
    </div>
  )
}
