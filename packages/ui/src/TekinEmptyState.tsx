import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { TekinButton } from './TekinButton'

export type TekinEmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function TekinEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: TekinEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[color:var(--tekin-gray-200)] bg-[color:var(--tekin-white)] px-8 py-14 text-center shadow-[var(--tekin-shadow-card)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--tekin-gray-100)] text-[color:var(--tekin-gray-600)]">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-[color:var(--tekin-gray-900)]">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-[color:var(--tekin-gray-600)]">
        {description}
      </p>
      {children}
      {actionLabel && onAction ? (
        <div className="mt-6">
          <TekinButton type="button" onClick={onAction}>
            {actionLabel}
          </TekinButton>
        </div>
      ) : null}
    </div>
  )
}
