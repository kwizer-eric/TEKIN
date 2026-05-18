/**
 * Screen: Manager settings — grouped toggles (local UI state only).
 */
import { TekinAlert, TekinButton, TekinCard, TekinInput } from '@tekin/ui'
import { useMemo, useState } from 'react'
import { RESTAURANT } from '../../data/fixtures'
import { MANAGER_SETTINGS_GROUPS } from './managerMocks'

export function ManagerSettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const g of MANAGER_SETTINGS_GROUPS) {
      for (const item of g.items) {
        initial[item.id] = item.on
      }
    }
    return initial
  })

  const dirtyCount = useMemo(() => {
    let n = 0
    for (const g of MANAGER_SETTINGS_GROUPS) {
      for (const item of g.items) {
        if (toggles[item.id] !== item.on) n += 1
      }
    }
    return n
  }, [toggles])

  return (
    <div className="flex flex-col gap-4">
      <TekinAlert
        severity="info"
        title="Demo controls"
        message="Toggles stay in-browser — persist via API when your tenant layer is ready."
      />

      <TekinCard>
        <h2 className="text-[16px] font-semibold text-tekin-gray-900">
          Venue profile
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TekinInput label="Trading name" defaultValue={RESTAURANT.name} readOnly />
          <TekinInput label="Tax profile" defaultValue="Rwanda · VAT standard" readOnly />
          <TekinInput className="md:col-span-2" label="Address" defaultValue={RESTAURANT.address} readOnly />
        </div>
      </TekinCard>

      {MANAGER_SETTINGS_GROUPS.map((group) => (
        <TekinCard key={group.title}>
          <h2 className="text-[16px] font-semibold text-tekin-gray-900">{group.title}</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {group.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-tekin-gray-100 px-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-tekin-gray-900">{item.label}</p>
                  <p className="mt-1 text-[13px] text-tekin-gray-600">{item.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggles[item.id]}
                  onClick={() =>
                    setToggles((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 ${
                    toggles[item.id] ? 'bg-tekin-emerald' : 'bg-tekin-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-tekin-white shadow transition-transform duration-200 ${
                      toggles[item.id] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </TekinCard>
      ))}

      <div className="flex flex-wrap gap-3">
        <TekinButton type="button" disabled={dirtyCount === 0}>
          Save changes {dirtyCount > 0 ? `(${dirtyCount})` : ''}
        </TekinButton>
        <TekinButton
          type="button"
          variant="secondary"
          onClick={() => {
            const reset: Record<string, boolean> = {}
            for (const g of MANAGER_SETTINGS_GROUPS) {
              for (const item of g.items) reset[item.id] = item.on
            }
            setToggles(reset)
          }}
        >
          Reset demo defaults
        </TekinButton>
      </div>
    </div>
  )
}
