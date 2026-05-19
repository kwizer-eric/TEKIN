/**
 * Screen: Manager stock — stock + menu + table controls.
 */
import { useMemo, useState } from 'react'
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import type { MenuKind, MenuShelf } from '../../data/fixtures'
import { useAppStore } from '../../stores/useAppStore'
import { MANAGER_STOCK_LINES } from './managerMocks'

const removeButtonClass =
  'border border-[color:var(--tekin-red)]/25 bg-[color:var(--tekin-red-light)] text-[color:var(--tekin-red)] hover:bg-[color:var(--tekin-red-light)] hover:opacity-90'

function stockStatus(status: (typeof MANAGER_STOCK_LINES)[0]['status']) {
  if (status === 'critical') return { badge: 'critical' as const, label: 'Reorder' }
  if (status === 'low') return { badge: 'warning' as const, label: 'Low cover' }
  return { badge: 'healthy' as const, label: 'Healthy' }
}

export function ManagerStockPage() {
  const menuItems = useAppStore((s) => s.menuItems)
  const addMenuItem = useAppStore((s) => s.addMenuItem)
  const updateMenuItem = useAppStore((s) => s.updateMenuItem)
  const removeMenuItem = useAppStore((s) => s.removeMenuItem)
  const tables = useAppStore((s) => s.tables)
  const addTable = useAppStore((s) => s.addTable)
  const updateTable = useAppStore((s) => s.updateTable)
  const removeTable = useAppStore((s) => s.removeTable)

  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('0')
  const [newKind, setNewKind] = useState<MenuKind>('beer')
  const [newShelf, setNewShelf] = useState<MenuShelf>('beer_soft')
  const [newTable, setNewTable] = useState('')

  const critical = MANAGER_STOCK_LINES.filter((l) => l.status === 'critical').length
  const low = MANAGER_STOCK_LINES.filter((l) => l.status === 'low').length
  const drinksCount = menuItems.filter((item) => item.kind !== 'food').length
  const foodCount = menuItems.filter((item) => item.kind === 'food').length

  const groupedMenu = useMemo(
    () => ({
      drinks: menuItems.filter((item) => item.kind !== 'food'),
      food: menuItems.filter((item) => item.kind === 'food'),
    }),
    [menuItems],
  )

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <TekinMetricCard
          label="Critical SKUs"
          value={critical}
          delta={{ text: 'Burn faster than cover', tone: critical > 0 ? 'warning' : 'positive' }}
        />
        <TekinMetricCard
          label="Low cover warnings"
          value={low}
          delta={{ text: 'Schedule vendor pings', tone: 'neutral' }}
        />
        <TekinMetricCard
          label="Drinks on menu"
          value={drinksCount}
          delta={{ text: 'Visible to waiter and cashier', tone: 'neutral' }}
        />
        <TekinMetricCard
          label="Food on menu"
          value={foodCount}
          delta={{ text: 'Kitchen-routed items', tone: 'neutral' }}
        />
      </section>

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Inventory sheet
            </h2>
            <p className="mt-1 text-[13px] text-tekin-gray-600">
              Demo counts — TEKIN would sync from counts + invoices.
            </p>
          </div>
          <TekinButton type="button" variant="secondary">
            Draft PO
          </TekinButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-tekin-gray-200 text-[11px] font-semibold uppercase tracking-wide text-tekin-gray-500">
                <th className="pb-3 pr-4">SKU</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">On hand</th>
                <th className="pb-3 pr-4">Par</th>
                <th className="pb-3 pr-4">Vendor</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MANAGER_STOCK_LINES.map((line) => {
                const st = stockStatus(line.status)
                return (
                  <tr key={line.sku} className="border-b border-tekin-gray-100">
                    <td className="py-3 pr-4 font-semibold text-tekin-gray-900">{line.sku}</td>
                    <td className="py-3 pr-4 text-tekin-gray-700">{line.category}</td>
                    <td className="py-3 pr-4 tabular-nums font-medium">{line.onHand}</td>
                    <td className="py-3 pr-4 tabular-nums text-tekin-gray-600">{line.par}</td>
                    <td className="py-3 pr-4 text-tekin-gray-700">{line.vendor}</td>
                    <td className="py-3">
                      <TekinBadge status={st.badge} label={st.label} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </TekinCard>

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">Menu control</h2>
            <p className="mt-1 text-[13px] text-tekin-gray-600">
              Add, edit, remove items, and update prices for waiter and cashier.
            </p>
          </div>
        </div>

        <div className="mb-5 grid gap-3 rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 p-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Item name"
            className="rounded-lg border border-tekin-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-tekin-emerald"
          />
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            min={0}
            className="rounded-lg border border-tekin-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-tekin-emerald"
          />
          <select
            value={newKind}
            onChange={(e) => {
              const kind = e.target.value as MenuKind
              setNewKind(kind)
              setNewShelf(kind === 'food' ? 'food' : kind === 'liquor' ? 'liquor' : 'beer_soft')
            }}
            className="rounded-lg border border-tekin-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-tekin-emerald"
          >
            <option value="liquor">Liquor</option>
            <option value="beer">Beer</option>
            <option value="soft">Soft</option>
            <option value="food">Food</option>
          </select>
          <select
            value={newShelf}
            onChange={(e) => setNewShelf(e.target.value as MenuShelf)}
            className="rounded-lg border border-tekin-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-tekin-emerald"
          >
            <option value="liquor">Liquor shelf</option>
            <option value="beer_soft">Beer & soft shelf</option>
            <option value="food">Food shelf</option>
          </select>
          <TekinButton
            type="button"
            onClick={() => {
              const parsedPrice = Number(newPrice)
              if (!newName.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) return
              addMenuItem({
                name: newName.trim(),
                priceRwf: parsedPrice,
                kind: newKind,
                shelf: newKind === 'food' ? 'food' : newShelf,
                prepMinutes: newKind === 'food' ? 12 : undefined,
              })
              setNewName('')
              setNewPrice('0')
            }}
          >
            Add item
          </TekinButton>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <MenuGroup
            title="Drinks"
            items={groupedMenu.drinks}
            updateMenuItem={updateMenuItem}
            removeMenuItem={removeMenuItem}
          />
          <MenuGroup
            title="Food"
            items={groupedMenu.food}
            updateMenuItem={updateMenuItem}
            removeMenuItem={removeMenuItem}
          />
        </div>
      </TekinCard>

      <TekinCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">Tables control</h2>
            <p className="text-[13px] text-tekin-gray-600">
              Add, rename, or remove tables. Changes appear for waiter and cashier.
            </p>
          </div>
          <TekinBadge status="info" label={`${tables.length} tables`} />
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            placeholder="New table label"
            className="rounded-lg border border-tekin-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-tekin-emerald"
          />
          <TekinButton
            type="button"
            onClick={() => {
              addTable(newTable)
              setNewTable('')
            }}
          >
            Add table
          </TekinButton>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <li key={table} className="flex items-center gap-2 rounded-xl border border-tekin-gray-200 p-2">
              <input
                defaultValue={table}
                onBlur={(e) => {
                  const next = e.target.value.trim()
                  if (next && next !== table) updateTable(table, next)
                }}
                className="min-w-0 flex-1 rounded-lg border border-tekin-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-tekin-emerald"
              />
              <TekinButton
                type="button"
                variant="ghost"
                className={removeButtonClass}
                onClick={() => removeTable(table)}
              >
                Remove
              </TekinButton>
            </li>
          ))}
        </ul>
      </TekinCard>
    </div>
  )
}

function MenuGroup({
  title,
  items,
  updateMenuItem,
  removeMenuItem,
}: {
  title: string
  items: {
    id: string
    name: string
    priceRwf: number
    kind: MenuKind
    shelf: MenuShelf
    prepMinutes?: number
  }[]
  updateMenuItem: (id: string, patch: { name?: string; priceRwf?: number }) => void
  removeMenuItem: (id: string) => void
}) {
  return (
    <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 p-3">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-tekin-gray-600">
        {title}
      </p>
      <ul className="flex max-h-[320px] flex-col gap-2 overflow-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-tekin-gray-200 bg-white p-2">
            <div className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
              <input
                defaultValue={item.name}
                onBlur={(e) => {
                  const value = e.target.value.trim()
                  if (value && value !== item.name) updateMenuItem(item.id, { name: value })
                }}
                className="rounded-lg border border-tekin-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-tekin-emerald"
              />
              <input
                type="number"
                defaultValue={item.priceRwf}
                min={0}
                onBlur={(e) => {
                  const value = Number(e.target.value)
                  if (Number.isFinite(value) && value > 0 && value !== item.priceRwf) {
                    updateMenuItem(item.id, { priceRwf: value })
                  }
                }}
                className="rounded-lg border border-tekin-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-tekin-emerald"
              />
              <TekinButton
                type="button"
                variant="ghost"
                className={removeButtonClass}
                onClick={() => removeMenuItem(item.id)}
              >
                Remove
              </TekinButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
