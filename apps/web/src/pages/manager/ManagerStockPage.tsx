/**
 * Screen: Manager stock — par levels & vendor mock sheet.
 */
import { TekinBadge, TekinButton, TekinCard, TekinMetricCard } from '@tekin/ui'
import { MANAGER_STOCK_LINES } from './managerMocks'

function stockStatus(status: (typeof MANAGER_STOCK_LINES)[0]['status']) {
  if (status === 'critical') return { badge: 'critical' as const, label: 'Reorder' }
  if (status === 'low') return { badge: 'warning' as const, label: 'Low cover' }
  return { badge: 'healthy' as const, label: 'Healthy' }
}

export function ManagerStockPage() {
  const critical = MANAGER_STOCK_LINES.filter((l) => l.status === 'critical').length
  const low = MANAGER_STOCK_LINES.filter((l) => l.status === 'low').length

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
    </div>
  )
}
