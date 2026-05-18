import type { HTMLAttributes } from 'react'

export type TekinBadgeStatus =
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'info'
  | 'neutral'

export type TekinBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: TekinBadgeStatus
  label: string
}

const styles: Record<
  TekinBadgeStatus,
  { wrap: string; dot: string; pulse?: boolean }
> = {
  healthy: {
    wrap: 'bg-[color:var(--tekin-emerald-light)] text-[color:var(--tekin-emerald)]',
    dot: 'bg-[color:var(--tekin-emerald)]',
  },
  warning: {
    wrap: 'bg-[color:var(--tekin-amber-light)] text-[color:var(--tekin-amber)]',
    dot: 'bg-[color:var(--tekin-amber)]',
  },
  critical: {
    wrap: 'bg-[color:var(--tekin-red-light)] text-[color:var(--tekin-red)]',
    dot: 'bg-[color:var(--tekin-red)] tekin-pulse-dot',
    pulse: true,
  },
  info: {
    wrap: 'bg-[color:var(--tekin-blue-light)] text-[color:var(--tekin-blue)]',
    dot: 'bg-[color:var(--tekin-blue)]',
  },
  neutral: {
    wrap: 'bg-[color:var(--tekin-gray-100)] text-[color:var(--tekin-gray-600)]',
    dot: 'bg-[color:var(--tekin-gray-400)]',
  },
}

export function TekinBadge({
  status,
  label,
  className = '',
  ...rest
}: TekinBadgeProps) {
  const s = styles[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[20px] px-2.5 py-[3px] text-[11px] font-medium tracking-wide ${s.wrap} ${className}`}
      {...rest}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`}
        aria-hidden
      />
      {label}
    </span>
  )
}
