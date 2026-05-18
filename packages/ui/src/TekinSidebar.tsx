import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type TekinNavItem = {
  path: string
  label: string
  icon: LucideIcon
  badge?: string | number
}

export type TekinSidebarRole =
  | 'manager'
  | 'cashier'
  | 'waiter'
  | 'kitchen'
  | 'consumer'

export type TekinSidebarProps = {
  brandLabel?: string
  role: TekinSidebarRole
  roleBadge?: string
  items: TekinNavItem[]
  activePath: string
  onNavigate?: (path: string) => void
  footer?: ReactNode
}

export function TekinSidebar({
  brandLabel = 'TEKIN',
  role,
  roleBadge,
  items,
  activePath,
  onNavigate,
  footer,
}: TekinSidebarProps) {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col bg-[color:var(--tekin-navy)] md:w-[240px] max-md:w-16 max-md:overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5 max-md:justify-center max-md:px-2">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--tekin-navy-muted)] text-[11px] font-semibold tracking-wide text-white"
          aria-hidden
        >
          TK
        </div>
        <div className="min-w-0 flex-1 max-md:hidden">
          <p className="truncate text-sm font-semibold text-white">{brandLabel}</p>
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">
            Business OS
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4 max-md:items-center max-md:px-2">
        {items.map((item) => {
          const active = activePath === item.path || activePath.startsWith(`${item.path}/`)
          const Icon = item.icon
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate?.(item.path)}
              className={`group flex w-full items-center gap-3 rounded-lg py-2.5 pl-3 pr-2 text-left text-sm transition-colors duration-150 max-md:w-12 max-md:justify-center max-md:px-0 max-md:py-3 ${
                active
                  ? 'border-l-[3px] border-[color:var(--tekin-emerald)] bg-[color:var(--tekin-navy-muted)] text-white'
                  : 'border-l-[3px] border-transparent text-white/80 hover:bg-[color:var(--tekin-navy-light)]'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" aria-hidden />
              <span className="min-w-0 flex-1 truncate font-medium max-md:hidden">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge !== '' ? (
                <span className="rounded-full bg-[color:var(--tekin-red)] px-2 py-0.5 text-[10px] font-semibold text-white max-md:hidden">
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4 max-md:hidden">
        {footer ?? (
          <div className="rounded-lg bg-[color:var(--tekin-navy-muted)] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Role
            </p>
            <p className="mt-0.5 text-sm font-medium capitalize text-white">
              {roleBadge ?? role}
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
