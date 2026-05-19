/**
 * Screen: Cashier — press counter orders only.
 */
import { TekinBadge, TekinButton, TekinCard } from '@tekin/ui'
import { useMemo, useState } from 'react'
import { formatRwf } from '../../lib/format'
import { useAppStore, type CartLine } from '../../stores/useAppStore'

type EntryCategory = 'drinks' | 'food'

export function CashierOrdersPage() {
  const menuItems = useAppStore((s) => s.menuItems)
  const tables = useAppStore((s) => s.tables)
  const createCashierOrder = useAppStore((s) => s.createCashierOrder)

  const [entryCategory, setEntryCategory] = useState<EntryCategory>('drinks')
  const [entryTable, setEntryTable] = useState<string>('')
  const [entryQuery, setEntryQuery] = useState('')
  const [entryLines, setEntryLines] = useState<CartLine[]>([])

  const entryItems = useMemo(() => {
    const q = entryQuery.trim().toLowerCase()
    return menuItems.filter((item) => {
      const inCategory =
        entryCategory === 'food'
          ? item.kind === 'food'
          : item.kind === 'liquor' || item.kind === 'beer' || item.kind === 'soft'
      if (!inCategory) return false
      if (!q) return true
      return item.name.toLowerCase().includes(q)
    })
  }, [entryCategory, entryQuery, menuItems])

  const entryTotal = useMemo(
    () =>
      entryLines.reduce((sum, line) => sum + line.unitPriceRwf * line.qty, 0),
    [entryLines],
  )

  const upsertEntryLine = (menuId: string) => {
    const item = menuItems.find((m) => m.id === menuId)
    if (!item) return
    setEntryLines((prev) => {
      const existing = prev.find((line) => line.menuId === menuId)
      if (existing) {
        return prev.map((line) =>
          line.menuId === menuId ? { ...line, qty: line.qty + 1 } : line,
        )
      }
      return [
        ...prev,
        {
          menuId: item.id,
          name: item.name,
          unitPriceRwf: item.priceRwf,
          qty: 1,
          kind: item.kind,
          prepMinutes: item.prepMinutes,
        },
      ]
    })
  }

  const setEntryQty = (menuId: string, qty: number) => {
    setEntryLines((prev) =>
      qty <= 0
        ? prev.filter((line) => line.menuId !== menuId)
        : prev.map((line) => (line.menuId === menuId ? { ...line, qty } : line)),
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <TekinCard className="min-h-[min(72vh,720px)] border-tekin-gray-200">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Press order at counter
            </h2>
            <p className="text-[13px] text-tekin-gray-600">
              Cashier and waiter share the same menu and tables. Track and settle
              floor tickets under Waiter balance.
            </p>
          </div>
          <TekinBadge status="info" label={`${entryLines.length} lines`} />
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {(['drinks', 'food'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setEntryCategory(cat)}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-wide ${
                entryCategory === cat
                  ? 'bg-tekin-navy text-white'
                  : 'bg-tekin-gray-100 text-tekin-gray-700 hover:bg-tekin-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <select
            value={entryTable}
            onChange={(e) => setEntryTable(e.target.value)}
            className="rounded-full border border-tekin-gray-200 bg-tekin-white px-3 py-2 text-sm text-tekin-gray-800"
          >
            <option value="">No table</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                Table {table}
              </option>
            ))}
          </select>
          <input
            value={entryQuery}
            onChange={(e) => setEntryQuery(e.target.value)}
            placeholder="Search menu"
            className="min-w-[220px] rounded-full border border-tekin-gray-200 bg-tekin-white px-3 py-2 text-sm text-tekin-gray-800 outline-none focus:border-tekin-emerald"
          />
        </div>
        <div className="grid min-h-[min(58vh,560px)] gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="grid min-h-[min(52vh,480px)] max-h-[min(52vh,480px)] grid-cols-1 gap-2 overflow-auto pr-1 sm:grid-cols-2">
            {entryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => upsertEntryLine(item.id)}
                className="rounded-xl border border-tekin-gray-200 bg-tekin-white px-3 py-3 text-left hover:border-tekin-emerald/40"
              >
                <p className="text-sm font-semibold text-tekin-gray-900">{item.name}</p>
                <p className="text-[12px] text-tekin-gray-600">{formatRwf(item.priceRwf)}</p>
              </button>
            ))}
          </div>
          <div className="flex min-h-[min(52vh,480px)] flex-col rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
              Order review
            </p>
            <ul className="mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-auto pr-1">
              {entryLines.length === 0 ? (
                <li className="text-[13px] text-tekin-gray-600">No items yet</li>
              ) : (
                entryLines.map((line) => (
                  <li key={line.menuId} className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-tekin-gray-800">
                      {line.qty}x {line.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="h-7 w-7 rounded-md border border-tekin-gray-200 bg-white"
                        onClick={() => setEntryQty(line.menuId, line.qty - 1)}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        className="h-7 w-7 rounded-md border border-tekin-gray-200 bg-white"
                        onClick={() => setEntryQty(line.menuId, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <p className="mt-3 text-lg font-semibold text-tekin-gray-900">
              {formatRwf(entryTotal)}
            </p>
            <TekinButton
              type="button"
              className="mt-3 w-full"
              disabled={entryLines.length === 0}
              onClick={() => {
                createCashierOrder({
                  table: entryTable || null,
                  lines: entryLines.map((line) => ({ ...line })),
                })
                setEntryLines([])
                setEntryTable('')
                setEntryQuery('')
              }}
            >
              Confirm and send
            </TekinButton>
          </div>
        </div>
      </TekinCard>
    </div>
  )
}
