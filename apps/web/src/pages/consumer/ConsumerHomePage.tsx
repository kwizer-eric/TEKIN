/**
 * Screen: Consumer trust home — Consumer — Confidence at a glance.
 */
import { TekinBadge, TekinCard, TekinMetricCard } from '@tekin/ui'
import { CONSUMER_PROFILE } from '../../data/fixtures'

export function ConsumerHomePage() {
  const utilization =
    Math.round(
      (CONSUMER_PROFILE.balanceUsedRwf / CONSUMER_PROFILE.creditLimitRwf) *
        100,
    )

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <TekinCard className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-tekin-gray-600">
              Trusted patron
            </p>
            <p className="mt-2 text-[26px] font-semibold text-tekin-gray-900">
              {CONSUMER_PROFILE.displayName}
            </p>
          </div>
          <TekinBadge status="healthy" label="Profile verified" />
        </div>
        <div className="rounded-2xl border border-tekin-gray-200 bg-tekin-gray-50 px-5 py-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-tekin-gray-600">
            Trust score
          </p>
          <p className="mt-3 text-[48px] font-semibold leading-none text-tekin-gray-900">
            {CONSUMER_PROFILE.trustScore}
          </p>
          <p className="mt-4 max-w-prose text-sm text-tekin-gray-600">
            You repay fast · lounges extend quieter perks · TEKIN keeps the ledger transparent.
          </p>
        </div>
      </TekinCard>

      <div className="grid gap-4">
        <TekinMetricCard
          label="Credit in play"
          value={`${utilization}%`}
          delta={{ text: 'Healthy utilization band', tone: 'neutral' }}
          unit="of limit"
        />
        <TekinCard>
          <p className="text-[13px] text-tekin-gray-600">
            TEKIN Consumer watches repayment rhythm — no guessing when limits breathe.
          </p>
          <div className="mt-4">
            <TekinBadge status="info" label="Signals updating nightly" />
          </div>
        </TekinCard>
      </div>
    </div>
  )
}
