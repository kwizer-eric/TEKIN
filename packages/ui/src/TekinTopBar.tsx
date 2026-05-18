import { Bell } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

export type TekinTopBarProps = {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
  showAlerts?: boolean
}

function formatClock(now: Date) {
  return now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function TekinTopBar({
  title,
  subtitle,
  rightSlot,
  showAlerts = true,
}: TekinTopBarProps) {
  const [clock, setClock] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatClock(new Date())), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[color:var(--tekin-gray-200)] bg-[color:var(--tekin-white)] px-6">
      <div className="min-w-0">
        <h1 className="truncate text-[22px] font-semibold leading-tight text-[color:var(--tekin-gray-900)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 truncate text-sm text-[color:var(--tekin-gray-600)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-4">
        <time
          dateTime={clock}
          className="hidden tabular-nums text-sm font-medium text-[color:var(--tekin-gray-800)] sm:block"
        >
          {clock}
        </time>
        {showAlerts ? (
          <button
            type="button"
            className="rounded-lg p-2 text-[color:var(--tekin-gray-600)] transition-colors hover:bg-[color:var(--tekin-gray-100)]"
            aria-label="Alerts"
          >
            <Bell className="h-5 w-5" />
          </button>
        ) : null}
        {rightSlot}
      </div>
    </header>
  )
}
