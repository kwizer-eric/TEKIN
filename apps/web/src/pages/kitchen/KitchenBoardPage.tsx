/**
 * Screen: Kitchen board — Kitchen — Accept first, then prep countdown.
 */
import { TekinBadge, TekinButton } from '@tekin/ui'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoleSwitcher } from '../../components/RoleSwitcher'
import { RESTAURANT } from '../../data/fixtures'
import { relativeOrAbsolute } from '../../lib/format'
import type { AppRole } from '../../stores/useAppStore'
import {
  useAppStore,
  type KitchenTicket,
  type KitchenTicketStatus,
} from '../../stores/useAppStore'

function formatClock(now: Date) {
  return now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function formatCountdownMs(ms: number): string {
  const sign = ms < 0 ? '−' : ''
  const abs = Math.abs(ms)
  const totalSec = Math.ceil(abs / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${sign}${m}:${s.toString().padStart(2, '0')}`
}

function columnTickets(
  tickets: KitchenTicket[],
  status: KitchenTicketStatus,
): KitchenTicket[] {
  return tickets
    .filter((t) => t.status === status)
    .slice()
    .sort((a, b) => a.startedAt - b.startedAt)
}

function waitingMinutes(ticket: KitchenTicket, nowTs: number): number {
  return Math.floor((nowTs - ticket.startedAt) / 60_000)
}

export function KitchenBoardPage() {
  const navigate = useNavigate()
  const tickets = useAppStore((s) => s.kitchenTickets)
  const advance = useAppStore((s) => s.advanceKitchenTicket)
  const revert = useAppStore((s) => s.revertKitchenTicket)
  const role = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)
  const waiterSession = useAppStore((s) => s.waiterSession)

  const [clock, setClock] = useState(() => formatClock(new Date()))
  const [nowTs, setNowTs] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date()
      setClock(formatClock(d))
      setNowTs(d.getTime())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const incoming = useMemo(
    () => columnTickets(tickets, 'incoming'),
    [tickets],
  )
  const preparing = useMemo(
    () => columnTickets(tickets, 'preparing'),
    [tickets],
  )
  const ready = useMemo(() => columnTickets(tickets, 'ready'), [tickets])

  const navigateRole = (next: AppRole) => {
    setRole(next)
    const dest =
      next === 'manager'
        ? '/manager/dashboard'
        : next === 'cashier'
          ? '/cashier/orders'
          : next === 'waiter'
            ? waiterSession != null
              ? '/waiter/new'
              : '/waiter/login'
            : next === 'kitchen'
              ? '/kitchen'
              : '/manager/dashboard'
    navigate(dest)
  }

  return (
    <div className="flex min-h-screen flex-col bg-tekin-gray-50">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-tekin-gray-200 bg-tekin-white px-6 py-4">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-tekin-gray-600">
            TEKIN Kitchen
          </p>
          <p className="truncate text-[18px] font-semibold text-tekin-gray-900">
            {RESTAURANT.name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <time
            className="tabular-nums text-[22px] font-semibold text-tekin-gray-900"
            dateTime={clock}
          >
            {clock}
          </time>
          <TekinButton type="button" variant="ghost" className="hidden sm:inline-flex">
            Sound on
          </TekinButton>
          <RoleSwitcher value={role} onChange={navigateRole} />
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-3 lg:p-6">
        <KitchenColumn
          title="Incoming"
          subtitle="Accept to start prep timer"
          tone="warning"
          tickets={incoming}
          nowTs={nowTs}
          onAdvance={advance}
        />
        <KitchenColumn
          title="Preparing"
          subtitle="Countdown from standard prep time"
          tone="info"
          tickets={preparing}
          nowTs={nowTs}
          onAdvance={advance}
        />
        <KitchenColumn
          title="Ready"
          subtitle="Expo pickup"
          tone="healthy"
          tickets={ready}
          nowTs={nowTs}
          onAdvance={advance}
          onRevert={revert}
        />
      </main>
    </div>
  )
}

type KitchenColumnProps = {
  title: string
  subtitle: string
  tone: 'warning' | 'info' | 'healthy'
  tickets: KitchenTicket[]
  nowTs: number
  onAdvance: (id: string) => void
  onRevert?: (id: string) => void
}

function KitchenColumn({
  title,
  subtitle,
  tone,
  tickets,
  nowTs,
  onAdvance,
  onRevert,
}: KitchenColumnProps) {
  const badgeStatus =
    tone === 'warning' ? 'warning' : tone === 'info' ? 'info' : 'healthy'

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-tekin-gray-200 bg-tekin-white p-4 shadow-card">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[18px] font-semibold text-tekin-gray-900">{title}</h2>
          <TekinBadge status={badgeStatus} label={`${tickets.length}`} />
        </div>
        <p className="text-[12px] font-medium text-tekin-gray-600">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-3">
        {tickets.map((ticket) => (
          <KitchenTicketCard
            key={ticket.id}
            ticket={ticket}
            nowTs={nowTs}
            onAdvance={onAdvance}
            onRevert={onRevert}
          />
        ))}
      </div>
    </section>
  )
}

type KitchenTicketCardProps = {
  ticket: KitchenTicket
  nowTs: number
  onAdvance: (id: string) => void
  onRevert?: (id: string) => void
}

function KitchenTicketCard({
  ticket,
  nowTs,
  onAdvance,
  onRevert,
}: KitchenTicketCardProps) {
  const waitMins = waitingMinutes(ticket, nowTs)

  let timerLabel: string
  let timerTone: string
  let footer: string

  if (ticket.status === 'incoming') {
    timerLabel = `${waitMins} min`
    timerTone =
      waitMins >= 8
        ? 'text-[color:var(--tekin-amber)]'
        : 'text-[color:var(--tekin-gray-800)]'
    footer = 'Tap card · Accept & start countdown'
  } else if (ticket.status === 'preparing') {
    const deadline = ticket.prepDeadlineTs ?? nowTs
    const remaining = deadline - nowTs
    timerLabel = formatCountdownMs(remaining)
    timerTone =
      remaining <= 0
        ? 'text-[color:var(--tekin-red)]'
        : remaining <= 120_000
          ? 'text-[color:var(--tekin-amber)]'
          : 'text-[color:var(--tekin-emerald)]'
    footer =
      remaining <= 0
        ? 'Over standard time · finish strong'
        : 'Prep window · tap when plated'
  } else {
    timerLabel = 'Done'
    timerTone = 'text-[color:var(--tekin-emerald)]'
    footer = 'Plated · undo if tapped by mistake'
  }

  const cardClass =
    'rounded-2xl border border-tekin-gray-200 bg-tekin-gray-50 px-4 py-4 text-left'

  const body = (
    <KitchenTicketCardBody
      ticket={ticket}
      timerLabel={timerLabel}
      timerTone={timerTone}
      footer={footer}
    />
  )

  if (ticket.status === 'ready' && onRevert) {
    return (
      <div className={cardClass}>
        {body}
        <TekinButton
          type="button"
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => onRevert(ticket.id)}
        >
          Undo · back to preparing
        </TekinButton>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onAdvance(ticket.id)}
      className={`${cardClass} transition-colors duration-150 hover:border-tekin-emerald hover:bg-tekin-emerald-light`}
    >
      {body}
    </button>
  )
}

function KitchenTicketCardBody({
  ticket,
  timerLabel,
  timerTone,
  footer,
}: {
  ticket: KitchenTicket
  timerLabel: string
  timerTone: string
  footer: string
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-tekin-gray-600">
            Order
          </p>
          <p className="text-[34px] font-semibold leading-none text-tekin-gray-900">
            {ticket.orderNumber}
          </p>
          <p className="mt-3 text-[18px] font-semibold text-tekin-gray-800">
            Table {ticket.table}
          </p>
        </div>
        <div className={`text-right text-[22px] font-semibold tabular-nums ${timerTone}`}>
          {timerLabel}
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-2 text-[17px] font-medium text-tekin-gray-900">
        {ticket.items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] font-medium text-tekin-gray-600">
        Fired {relativeOrAbsolute(ticket.startedAt)}
      </p>
      <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-tekin-gray-500">
        {footer}
      </p>
    </>
  )
}
