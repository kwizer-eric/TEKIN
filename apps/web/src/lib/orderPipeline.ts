import type { CashierOrderRow } from '../data/fixtures'

/** Minimal kitchen row shape — avoids importing the store from pure helpers. */
export type KitchenTicketRef = {
  orderNumber: string
  status: 'incoming' | 'preparing' | 'ready'
}

export type PipelineBadgeTone = 'warning' | 'info' | 'healthy' | 'neutral'

export type PipelineStatus = {
  label: string
  badge: PipelineBadgeTone
}

/** True while payment or waiter hand-in still needs cashier attention. */
export function isOrderHappening(o: CashierOrderRow): boolean {
  if (!o.paid) return true
  if (o.channel === 'waiter' && !o.waiterHandoverComplete) return true
  return false
}

export function pipelineStatusForOrder(
  o: CashierOrderRow,
  kitchenTickets: KitchenTicketRef[],
): PipelineStatus {
  if (o.channel !== 'waiter') {
    if (o.paid) return { label: 'Completed', badge: 'healthy' }
    return { label: 'Awaiting gateway', badge: 'warning' }
  }

  if (!o.paid) {
    const hasFood = o.lines?.some((l) => l.kind === 'food') ?? false
    if (!hasFood) {
      return { label: 'Bar · pour queue', badge: 'info' }
    }
    const kt = kitchenTickets.find((t) => t.orderNumber === o.id)
    if (!kt) {
      return { label: 'Kitchen · syncing', badge: 'neutral' }
    }
    switch (kt.status) {
      case 'incoming':
        return { label: 'Kitchen · accept pending', badge: 'warning' }
      case 'preparing':
        return { label: 'Kitchen · preparing', badge: 'info' }
      case 'ready':
        return { label: 'Kitchen · ready', badge: 'healthy' }
      default:
        return { label: 'Kitchen', badge: 'neutral' }
    }
  }

  if (!o.waiterHandoverComplete) {
    return { label: 'Paid · hand-in due', badge: 'warning' }
  }
  return { label: 'Closed', badge: 'healthy' }
}
