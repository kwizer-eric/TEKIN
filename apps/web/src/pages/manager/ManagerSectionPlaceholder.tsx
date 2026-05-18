import { TekinButton, TekinCard, TekinEmptyState } from '@tekin/ui'
import { ClipboardList } from 'lucide-react'

export type ManagerSectionPlaceholderProps = {
  headline: string
  body: string
  actionLabel?: string
}

export function ManagerSectionPlaceholder({
  headline,
  body,
  actionLabel = 'Open queue',
}: ManagerSectionPlaceholderProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <TekinCard className="min-h-[200px]">
        <h2 className="text-[16px] font-semibold text-tekin-gray-900">{headline}</h2>
        <p className="mt-2 max-w-prose text-sm text-tekin-gray-600">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <TekinButton type="button">{actionLabel}</TekinButton>
          <TekinButton type="button" variant="secondary">
            View history
          </TekinButton>
        </div>
      </TekinCard>
      <TekinEmptyState
        icon={ClipboardList}
        title="Nothing queued here yet"
        description="Wire your backend stream — TEKIN will populate this automatically."
      />
    </div>
  )
}
