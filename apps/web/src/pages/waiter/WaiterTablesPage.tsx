/**
 * Screen: Waiter tables — Waiter — Claim the floor fast.
 */
import { TekinCard } from '@tekin/ui'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/useAppStore'

const TABLES = Array.from({ length: 16 }, (_, i) => i + 1)

export function WaiterTablesPage() {
  const navigate = useNavigate()
  const selected = useAppStore((s) => s.waiterTable)
  const setTable = useAppStore((s) => s.setWaiterTable)

  return (
    <div className="flex flex-col gap-4">
      <TekinCard className="border border-tekin-emerald bg-tekin-emerald-light">
        <p className="text-[13px] font-medium text-tekin-gray-800">
          Tap a table, then head to <span className="font-semibold">New order</span> — TEKIN keeps the flow tight.
        </p>
      </TekinCard>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {TABLES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              setTable(n)
              navigate('/waiter/new')
            }}
            className={`min-h-[64px] rounded-2xl border text-[20px] font-semibold transition-colors duration-150 ${
              selected === n
                ? 'border-tekin-emerald bg-tekin-emerald text-white'
                : 'border-tekin-gray-200 bg-tekin-white text-tekin-gray-900 hover:bg-tekin-gray-50'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
