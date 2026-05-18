export function formatRwf(amount: number): string {
  const formatted = new Intl.NumberFormat('en-RW', {
    maximumFractionDigits: 0,
  }).format(amount)
  return `${formatted} RWF`
}

export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '' : ''
  return `${sign}${value}%`
}

export function trendArrow(dir: 'up' | 'down' | 'flat'): string {
  if (dir === 'up') return '↑'
  if (dir === 'down') return '↓'
  return '→'
}

export function relativeOrAbsolute(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return `${Math.max(1, Math.floor(diff / 1000))} sec ago`
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} min ago`
  const d = new Date(ts)
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
