export type TekinLiveIndicatorProps = {
  label?: string
  className?: string
}

export function TekinLiveIndicator({
  label = 'Live',
  className = '',
}: TekinLiveIndicatorProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-[color:var(--tekin-gray-600)] ${className}`}
    >
      <span
        className="relative flex h-2 w-2"
        aria-hidden
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--tekin-emerald)] opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--tekin-emerald)]" />
      </span>
      {label}
    </span>
  )
}
