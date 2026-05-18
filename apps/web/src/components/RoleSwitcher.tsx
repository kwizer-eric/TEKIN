import type { AppRole } from '../stores/useAppStore'

const ROLE_LABEL: Record<AppRole, string> = {
  manager: 'Manager',
  cashier: 'Cashier',
  waiter: 'Waiter',
  kitchen: 'Kitchen',
  consumer: 'Consumer',
}

export type RoleSwitcherProps = {
  value: AppRole
  onChange: (role: AppRole) => void
}

export function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  return (
    <label className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-[color:var(--tekin-gray-600)]">
      View as
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AppRole)}
        className="rounded-lg border border-[color:var(--tekin-gray-200)] bg-[color:var(--tekin-white)] px-2 py-1.5 text-[13px] font-medium normal-case tracking-normal text-[color:var(--tekin-gray-800)] outline-none focus:border-[color:var(--tekin-emerald)]"
      >
      {(Object.keys(ROLE_LABEL) as AppRole[]).map((r) => (
        <option key={r} value={r}>
          {ROLE_LABEL[r]}
        </option>
      ))}
      </select>
    </label>
  )
}
