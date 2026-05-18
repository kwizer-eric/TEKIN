import type { HTMLAttributes, ReactNode } from 'react'

export type TekinCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  padding?: 'default' | 'compact'
  border?: boolean
}

export function TekinCard({
  children,
  className = '',
  padding = 'default',
  border = true,
  ...rest
}: TekinCardProps) {
  const pad = padding === 'compact' ? 'px-5 py-4' : 'px-6 py-5'
  const borderCls = border ? 'border border-[color:var(--tekin-gray-200)]' : ''
  return (
    <div
      className={`rounded-xl bg-[color:var(--tekin-white)] shadow-[var(--tekin-shadow-card)] ${borderCls} ${pad} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
