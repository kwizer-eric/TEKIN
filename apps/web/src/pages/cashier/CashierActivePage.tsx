/**
 * Screen: Cashier active lane — Cashier — All tickets, waiter hold, counter payments.
 */
import {
  TekinBadge,
  TekinButton,
  TekinCard,
  TekinInput,
  TekinMetricCard,
} from '@tekin/ui'
import { useMemo, useState } from 'react'
import type { CashierOrderChannel, MenuKind } from '../../data/fixtures'
import { formatRwf, relativeOrAbsolute } from '../../lib/format'
import { useAppStore } from '../../stores/useAppStore'

type CashierFilter = 'all' | 'unpaid' | 'waiter' | 'direct' | 'handover'

function channelLabel(c: CashierOrderChannel): string {
  const labels: Record<CashierOrderChannel, string> = {
    waiter: 'Floor waiter',
    online: 'Online',
    nearby: 'Nearby',
    table_qr: 'Table QR',
  }
  return labels[c]
}

function lineKindLabel(k: MenuKind): string {
  const labels: Record<MenuKind, string> = {
    liquor: 'Liquor',
    beer: 'Beer',
    soft: 'Soft',
    food: 'Kitchen',
  }
  return labels[k]
}

export function CashierActivePage() {
  const orders = useAppStore((s) => s.cashierOrders)
  const markPaid = useAppStore((s) => s.markPaid)
  const completeWaiterHandover = useAppStore((s) => s.completeWaiterHandover)

  const [filter, setFilter] = useState<CashierFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [method, setMethod] = useState<'Cash' | 'MoMo' | 'Card'>('Cash')

  const metrics = useMemo(() => {
    const waiterHold = orders
      .filter((o) => o.channel === 'waiter' && !o.paid)
      .reduce((s, o) => s + o.totalRwf, 0)
    const needsHandover = orders
      .filter(
        (o) =>
          o.channel === 'waiter' &&
          o.paid &&
          !o.waiterHandoverComplete,
      )
      .reduce((s, o) => s + o.totalRwf, 0)
    const cashierCustody = orders
      .filter((o) => o.channel !== 'waiter' && o.paid)
      .reduce((s, o) => s + o.totalRwf, 0)
    const unpaidCount = orders.filter((o) => !o.paid).length
    return { waiterHold, needsHandover, cashierCustody, unpaidCount }
  }, [orders])

  const filteredOrders = useMemo(() => {
    let list = [...orders]
    switch (filter) {
      case 'unpaid':
        list = list.filter((o) => !o.paid)
        break
      case 'waiter':
        list = list.filter((o) => o.channel === 'waiter')
        break
      case 'direct':
        list = list.filter((o) => o.channel !== 'waiter')
        break
      case 'handover':
        list = list.filter(
          (o) =>
            o.channel === 'waiter' &&
            o.paid &&
            !o.waiterHandoverComplete,
        )
        break
      default:
        break
    }
    return list.sort((a, b) => b.receivedAt - a.receivedAt)
  }, [orders, filter])

  const selected = useMemo(() => {
    if (!selectedId) return undefined
    const row = orders.find((o) => o.id === selectedId)
    if (!row) return undefined
    if (!filteredOrders.some((o) => o.id === selectedId)) return undefined
    return row
  }, [orders, selectedId, filteredOrders])

  const filterTabs: { id: CashierFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unpaid', label: 'Unpaid' },
    { id: 'waiter', label: 'Floor' },
    { id: 'direct', label: 'Direct pay' },
    { id: 'handover', label: 'Waiter settle' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <TekinMetricCard
          label="Waiter hold (unpaid floor)"
          value={formatRwf(metrics.waiterHold)}
          delta={{
            text:
              metrics.unpaidCount > 0
                ? `${metrics.unpaidCount} ticket${metrics.unpaidCount === 1 ? '' : 's'} open`
                : 'Floor clear',
            tone: metrics.waiterHold > 0 ? 'warning' : 'positive',
          }}
        />
        <TekinMetricCard
          label="Paid · needs waiter hand-in"
          value={formatRwf(metrics.needsHandover)}
          delta={{
            text: 'Counter took payment — confirm waiter',
            tone: metrics.needsHandover > 0 ? 'warning' : 'neutral',
          }}
        />
        <TekinMetricCard
          label="Cashier custody (direct)"
          value={formatRwf(metrics.cashierCustody)}
          delta={{
            text: 'QR · online · nearby — venue ledger',
            tone: 'neutral',
          }}
        />
      </section>

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setFilter(tab.id)
              setSelectedId(null)
            }}
            className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-wide transition-colors duration-150 ${
              filter === tab.id
                ? 'bg-tekin-navy text-white'
                : 'bg-tekin-gray-100 text-tekin-gray-700 hover:bg-tekin-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <TekinCard className="min-h-[420px]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              Orders received
            </h2>
            <TekinBadge status="info" label={`${filteredOrders.length} shown`} />
          </div>
          <ul className="flex flex-col gap-3">
            {filteredOrders.map((o) => {
              const waiterPending =
                o.channel === 'waiter' &&
                o.paid &&
                !o.waiterHandoverComplete
              const subtitle =
                o.channel === 'waiter'
                  ? `${o.placedByWaiterName ?? 'Waiter'} · Table ${o.table ?? '—'}`
                  : (o.routeNote ??
                    (o.table ? `Table ${o.table}` : 'Venue direct'))

              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(o.id)}
                    className={`flex w-full min-h-[52px] flex-col gap-2 rounded-xl border px-4 py-3 text-left transition-colors duration-150 sm:flex-row sm:items-center sm:justify-between ${
                      selectedId === o.id
                        ? 'border-tekin-emerald bg-tekin-emerald-light'
                        : 'border-tekin-gray-200 bg-tekin-white hover:bg-tekin-gray-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-semibold text-tekin-gray-900">
                          {o.id}
                        </p>
                        <TekinBadge status="neutral" label={channelLabel(o.channel)} />
                        {!o.paid ? (
                          <TekinBadge status="warning" label="Unpaid" />
                        ) : waiterPending ? (
                          <TekinBadge status="warning" label="Hand-in due" />
                        ) : o.channel === 'waiter' ? (
                          <TekinBadge status="healthy" label="Closed with waiter" />
                        ) : (
                          <TekinBadge status="healthy" label="Paid direct" />
                        )}
                        {o.barQueuePriority ? (
                          <TekinBadge status="info" label="Bar first" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-[13px] text-tekin-gray-600">
                        {subtitle}
                      </p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-tekin-gray-400">
                        In {relativeOrAbsolute(o.receivedAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                      <span className="text-[20px] font-semibold text-tekin-gray-900">
                        {formatRwf(o.totalRwf)}
                      </span>
                      {o.paid && o.method ? (
                        <span className="text-[12px] font-medium text-tekin-gray-600">
                          {o.method}
                        </span>
                      ) : null}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </TekinCard>

        <TekinCard className="flex flex-col gap-4">
          <h2 className="text-[16px] font-semibold text-tekin-gray-900">
            Payment & settlement
          </h2>
          {selected != null &&
          selected.lines != null &&
          selected.lines.length > 0 ? (
            <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                Line breakdown
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {selected.lines.map((line, idx) => (
                  <li
                    key={`${line.name}-${idx}`}
                    className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-tekin-gray-800"
                  >
                    <span>
                      <span className="font-semibold text-tekin-gray-900">
                        {line.qty}×
                      </span>{' '}
                      {line.name}
                    </span>
                    <TekinBadge
                      status={line.kind === 'food' ? 'warning' : 'neutral'}
                      label={lineKindLabel(line.kind)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {!selected ? (
            <p className="text-sm text-tekin-gray-600">
              Select an order — floor tabs show who placed it and what is still with the waiter.
            </p>
          ) : selected.channel !== 'waiter' ? (
            <div className="flex flex-col gap-3">
              <TekinAlertInline
                title="Direct channel"
                body="Guest paid at source — TEKIN books this under cashier custody for reporting. No counter collection unless you issue a refund adjustment."
                variant="info"
              />
              <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                  Amount recorded
                </p>
                <p className="mt-2 text-[28px] font-semibold text-tekin-gray-900">
                  {formatRwf(selected.totalRwf)}
                </p>
              </div>
              <TekinBadge
                status={selected.paid ? 'healthy' : 'warning'}
                label={
                  selected.paid
                    ? `Paid · ${selected.method ?? ''}`
                    : 'Awaiting gateway'
                }
              />
            </div>
          ) : !selected.paid ? (
            <>
              <div className="rounded-xl border border-tekin-amber bg-tekin-amber-light px-4 py-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-tekin-gray-600">
                  With waiter until collected
                </p>
                <p className="mt-2 text-[15px] font-semibold text-tekin-gray-900">
                  {selected.placedByWaiterName ?? 'Waiter'} · Table{' '}
                  {selected.table ?? '—'}
                </p>
                <p className="mt-3 text-[32px] font-semibold text-tekin-gray-900">
                  {formatRwf(selected.totalRwf)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['Cash', 'MoMo', 'Card', 'Split'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    disabled={m === 'Split'}
                    onClick={() =>
                      m !== 'Split' && setMethod(m as typeof method)
                    }
                    className={`min-h-[52px] rounded-xl border text-[15px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
                      method === m
                        ? 'border-tekin-emerald bg-tekin-emerald-light text-tekin-emerald'
                        : 'border-tekin-gray-200 bg-tekin-white text-tekin-gray-900 hover:bg-tekin-gray-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <TekinInput label="Reference (optional)" placeholder="MoMo TX id…" />
              <TekinButton
                type="button"
                className="min-h-[52px] w-full text-[15px]"
                onClick={() => markPaid(selected.id, method)}
              >
                Confirm payment
              </TekinButton>
            </>
          ) : !selected.waiterHandoverComplete ? (
            <>
              <TekinAlertInline
                title="Guest paid at counter"
                body={`Confirm ${selected.placedByWaiterName ?? 'the waiter'} handed you ${formatRwf(selected.totalRwf)} — only then close this ticket.`}
                variant="warning"
              />
              <TekinButton
                type="button"
                className="min-h-[52px] w-full text-[15px]"
                onClick={() => completeWaiterHandover(selected.id)}
              >
                Settle with waiter
              </TekinButton>
            </>
          ) : (
            <div className="rounded-xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4">
              <p className="text-sm font-semibold text-tekin-gray-900">
                Ticket balanced with floor staff.
              </p>
              <p className="mt-2 text-[13px] text-tekin-gray-600">
                {selected.placedByWaiterName} · {formatRwf(selected.totalRwf)}{' '}
                · {selected.method}
              </p>
            </div>
          )}
        </TekinCard>
      </div>
    </div>
  )
}

function TekinAlertInline({
  title,
  body,
  variant,
}: {
  title: string
  body: string
  variant: 'info' | 'warning'
}) {
  const box =
    variant === 'warning'
      ? 'border-tekin-amber bg-tekin-amber-light'
      : 'border-tekin-blue bg-tekin-blue-light'
  const titleCls =
    variant === 'warning' ? 'text-tekin-amber' : 'text-tekin-blue'
  return (
    <div className={`rounded-xl border px-4 py-3 ${box}`}>
      <p className={`text-[13px] font-semibold ${titleCls}`}>{title}</p>
      <p className="mt-1 text-[13px] text-tekin-gray-800">{body}</p>
    </div>
  )
}
