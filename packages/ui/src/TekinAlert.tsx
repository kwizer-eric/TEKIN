import type { HTMLAttributes, ReactNode } from 'react'

export type TekinAlertSeverity = 'success' | 'warning' | 'critical' | 'info'

export type TekinAlertProps = HTMLAttributes<HTMLDivElement> & {
  severity: TekinAlertSeverity
  title: string
  message: ReactNode
}

const bar: Record<TekinAlertSeverity, string> = {
  success: 'border-l-[color:var(--tekin-emerald)] bg-[color:var(--tekin-emerald-light)]',
  warning: 'border-l-[color:var(--tekin-amber)] bg-[color:var(--tekin-amber-light)]',
  critical: 'border-l-[color:var(--tekin-red)] bg-[color:var(--tekin-red-light)]',
  info: 'border-l-[color:var(--tekin-blue)] bg-[color:var(--tekin-blue-light)]',
}

const titleColor: Record<TekinAlertSeverity, string> = {
  success: 'text-[color:var(--tekin-emerald)]',
  warning: 'text-[color:var(--tekin-amber)]',
  critical: 'text-[color:var(--tekin-red)]',
  info: 'text-[color:var(--tekin-blue)]',
}

export function TekinAlert({
  severity,
  title,
  message,
  className = '',
  ...rest
}: TekinAlertProps) {
  return (
    <div
      role="status"
      className={`rounded-xl border border-[color:var(--tekin-gray-200)] border-l-[3px] px-5 py-4 ${bar[severity]} ${className}`}
      {...rest}
    >
      <p className={`text-sm font-semibold ${titleColor[severity]}`}>{title}</p>
      <div className="mt-1 text-sm text-[color:var(--tekin-gray-800)]">
        {message}
      </div>
    </div>
  )
}
