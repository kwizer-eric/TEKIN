import type { ReactNode } from 'react'
import { TekinCard } from './TekinCard'

export type TekinMetricDeltaTone = 'positive' | 'negative' | 'warning' | 'neutral'

export type TekinMetricCardProps = {
  label: string
  value: ReactNode
  delta?: {
    text: string
    tone?: TekinMetricDeltaTone
  }
  unit?: string
  className?: string
}

const deltaTone: Record<
  TekinMetricDeltaTone,
  { bg: string; text: string }
> = {
  positive: {
    bg: 'bg-[color:var(--tekin-emerald-light)]',
    text: 'text-[color:var(--tekin-emerald)]',
  },
  negative: {
    bg: 'bg-[color:var(--tekin-red-light)]',
    text: 'text-[color:var(--tekin-red)]',
  },
  warning: {
    bg: 'bg-[color:var(--tekin-amber-light)]',
    text: 'text-[color:var(--tekin-amber)]',
  },
  neutral: {
    bg: 'bg-[color:var(--tekin-gray-100)]',
    text: 'text-[color:var(--tekin-gray-600)]',
  },
}

export function TekinMetricCard({
  label,
  value,
  delta,
  unit,
  className = '',
}: TekinMetricCardProps) {
  const tone = deltaTone[delta?.tone ?? 'neutral']
  return (
    <TekinCard className={`flex flex-col gap-3 ${className}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--tekin-gray-600)]">
        {label}
      </p>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-[30px] font-semibold leading-none tracking-tight text-[color:var(--tekin-gray-900)]">
          {value}
        </span>
        {unit ? (
          <span className="text-[13px] font-normal text-[color:var(--tekin-gray-600)]">
            {unit}
          </span>
        ) : null}
      </div>
      {delta ? (
        <span
          className={`w-fit rounded-[20px] px-2.5 py-[3px] text-[12px] font-medium ${tone.bg} ${tone.text}`}
        >
          {delta.text}
        </span>
      ) : null}
    </TekinCard>
  )
}
